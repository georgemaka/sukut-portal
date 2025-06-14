# Sukutapps.com Domain Configuration Guide

## Overview
This guide specifically covers setting up sukutapps.com with your Sukut Portal deployment on AWS.

## Current Status
- ✅ Domain registered: sukutapps.com (in Route 53)
- ⏳ Next: Configure domain with CloudFront and SSL

## Step-by-Step Domain Setup

### Step 1: Request SSL Certificate (Required for HTTPS)

```bash
# Request certificate in us-east-1 (required for CloudFront)
aws acm request-certificate \
  --domain-name sukutapps.com \
  --subject-alternative-names "*.sukutapps.com" \
  --validation-method DNS \
  --region us-east-1
```

**Important**: Save the Certificate ARN from the output. It looks like:
`arn:aws:acm:us-east-1:123456789:certificate/abc-123-def`

### Step 2: Validate the Certificate

1. The command above will output DNS validation records
2. Or check in AWS Console: Certificate Manager → Your certificate → Create records in Route 53
3. Click "Create records" button to auto-add validation records
4. Wait 5-10 minutes for validation (status will change to "Issued")

### Step 3: Create/Update CloudFront Distribution

Create `cloudfront-with-domain.json`:
```json
{
  "CallerReference": "sukutapps-$(date +%s)",
  "Comment": "Sukut Apps Portal",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [{
      "Id": "S3-sukut-portal-production",
      "DomainName": "sukut-portal-production.s3-website-us-east-1.amazonaws.com",
      "CustomOriginConfig": {
        "HTTPPort": 80,
        "HTTPSPort": 443,
        "OriginProtocolPolicy": "http-only"
      }
    }]
  },
  "Aliases": {
    "Quantity": 2,
    "Items": ["sukutapps.com", "www.sukutapps.com"]
  },
  "ViewerCertificate": {
    "ACMCertificateArn": "YOUR_CERTIFICATE_ARN_HERE",
    "SSLSupportMethod": "sni-only",
    "MinimumProtocolVersion": "TLSv1.2_2021"
  },
  "DefaultCacheBehavior": {
    "TargetOriginId": "S3-sukut-portal-production",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 2,
      "Items": ["GET", "HEAD"]
    },
    "Compress": true,
    "ForwardedValues": {
      "QueryString": false,
      "Cookies": {"Forward": "none"}
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [{
      "ErrorCode": 404,
      "ResponsePagePath": "/index.html",
      "ResponseCode": "200",
      "ErrorCachingMinTTL": 300
    }]
  },
  "Enabled": true
}
```

Deploy CloudFront:
```bash
# Replace YOUR_CERTIFICATE_ARN_HERE with actual ARN
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-with-domain.json
```

Save the Distribution ID and Domain Name from output.

### Step 4: Configure Route 53

```bash
# Get your hosted zone ID
aws route53 list-hosted-zones --query "HostedZones[?Name=='sukutapps.com.']"
```

Create `route53-records.json`:
```json
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "sukutapps.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "YOUR_CLOUDFRONT_DOMAIN.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    },
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "www.sukutapps.com",
        "Type": "A",
        "AliasTarget": {
          "HostedZoneId": "Z2FDTNDATAQYW2",
          "DNSName": "YOUR_CLOUDFRONT_DOMAIN.cloudfront.net",
          "EvaluateTargetHealth": false
        }
      }
    }
  ]
}
```

Apply the records:
```bash
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch file://route53-records.json
```

**Note**: Z2FDTNDATAQYW2 is CloudFront's hosted zone ID (always the same).

## Subdomain Setup for Other Apps

### For Each App Subdomain:

1. **Timecard App** (timecard.sukutapps.com):
```bash
# Deploy app to S3
aws s3 mb s3://sukutapps-timecard
# ... (follow S3 deployment steps)

# Create CloudFront distribution with:
"Aliases": {
  "Quantity": 1,
  "Items": ["timecard.sukutapps.com"]
}
```

2. **Add Route 53 Record**:
```json
{
  "Action": "CREATE",
  "ResourceRecordSet": {
    "Name": "timecard.sukutapps.com",
    "Type": "A",
    "AliasTarget": {
      "HostedZoneId": "Z2FDTNDATAQYW2",
      "DNSName": "timecard-distribution.cloudfront.net",
      "EvaluateTargetHealth": false
    }
  }
}
```

## Updated Deployment Script

Create `deploy-production.sh`:
```bash
#!/bin/bash
set -e

DISTRIBUTION_ID="YOUR_DISTRIBUTION_ID"
S3_BUCKET="sukut-portal-production"

echo "🏗️ Building Sukut Portal..."
npm run build

echo "📦 Deploying to S3..."
aws s3 sync dist/ s3://$S3_BUCKET \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html" \
  --exclude "*.map"

aws s3 cp dist/index.html s3://$S3_BUCKET/index.html \
  --cache-control "no-cache, no-store, must-revalidate"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
echo "🌐 View at: https://sukutapps.com"
```

## App Configuration Update

Update your `src/config/appConfig.ts`:
```typescript
export const externalApps = {
  timecard: {
    name: 'Timecard App',
    url: 'https://timecard.sukutapps.com',
    icon: Clock,
  },
  equipment: {
    name: 'Equipment Manager', 
    url: 'https://equipment.sukutapps.com',
    icon: Truck,
  },
  safety: {
    name: 'Safety Tracker',
    url: 'https://safety.sukutapps.com',
    icon: Shield,
  }
};

// For development
const isDevelopment = import.meta.env.DEV;
if (isDevelopment) {
  // Override URLs for local development
  externalApps.timecard.url = 'http://localhost:3001';
  externalApps.equipment.url = 'http://localhost:3002';
}
```

## DNS Propagation

After setup:
- DNS changes take 5-60 minutes to propagate
- Test with: `nslookup sukutapps.com`
- CloudFront distribution takes 15-20 minutes to deploy

## Your Domain Structure

```
sukutapps.com              → Main Portal
├── www.sukutapps.com      → Redirects to main
├── timecard.sukutapps.com → Timecard Application
├── equipment.sukutapps.com → Equipment Manager
├── safety.sukutapps.com   → Safety Tracker
├── api.sukutapps.com      → Backend API (future)
└── staging.sukutapps.com  → Staging environment
```

## SSL Certificate Coverage

Your wildcard certificate (*.sukutapps.com) covers:
- ✅ All subdomains (timecard, equipment, etc.)
- ✅ www.sukutapps.com
- ✅ sukutapps.com (via Subject Alternative Name)

## Next Steps

1. Complete SSL certificate validation
2. Create CloudFront distribution with domain
3. Configure Route 53 records
4. Test https://sukutapps.com
5. Set up subdomains for other apps

## Troubleshooting

**Certificate not validating?**
- Check Route 53 for CNAME validation records
- Ensure records are in the correct hosted zone

**Domain not working?**
- Check CloudFront distribution status (must be "Deployed")
- Verify Route 53 alias records point to CloudFront
- Clear browser cache and try incognito mode

**Getting "Bad Request" error?**
- Ensure CloudFront aliases match exactly
- Certificate must include the domain you're accessing