# AWS Deployment Guide for Sukut Portal

## Overview
This guide will walk you through deploying your Sukut Portal on AWS, connecting other web apps, and maintaining continuous updates.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [AWS Account Setup](#aws-account-setup)
3. [Deployment Architecture](#deployment-architecture)
4. [Step-by-Step Deployment](#step-by-step-deployment)
5. [Connecting Other Apps](#connecting-other-apps)
6. [Update & Maintenance Workflow](#update--maintenance-workflow)
7. [Best Practices](#best-practices)

## Prerequisites

### Required Tools
- [ ] AWS Account
- [ ] AWS CLI installed locally
- [ ] Node.js 18+ installed
- [ ] Git installed
- [ ] Domain name (optional but recommended)

### Install AWS CLI
```bash
# macOS
brew install awscli

# Verify installation
aws --version
```

## AWS Account Setup

### 1. Create AWS Account
1. Go to [aws.amazon.com](https://aws.amazon.com)
2. Click "Create an AWS Account"
3. Follow the registration process
4. Set up billing alerts to avoid unexpected charges

### 2. Create IAM User
1. Go to IAM Console
2. Create a new user with programmatic access
3. Attach policies:
   - `AmazonS3FullAccess`
   - `CloudFrontFullAccess`
   - `AmazonRoute53FullAccess` (if using custom domain)
4. Save the Access Key ID and Secret Access Key

### 3. Configure AWS CLI
```bash
aws configure
# Enter your Access Key ID
# Enter your Secret Access Key
# Default region: us-east-1
# Default output format: json
```

## Deployment Architecture

### Recommended Architecture for React Apps
```
┌─────────────────┐     ┌──────────────┐     ┌─────────────┐
│   CloudFront   │────▶│   S3 Bucket  │     │   Route 53  │
│      (CDN)     │     │ (Static Files)│     │   (DNS)     │
└─────────────────┘     └──────────────┘     └─────────────┘
        │                                            │
        └────────────────────────────────────────────┘
                    Custom Domain (optional)
```

### Why This Architecture?
- **S3**: Stores your built React files (HTML, JS, CSS)
- **CloudFront**: Global CDN for fast loading worldwide
- **Route 53**: Manages custom domain (optional)
- **Cost-effective**: Pay only for storage and bandwidth used

## Step-by-Step Deployment

### Phase 1: Initial Setup

#### 1. Build Your Application
```bash
cd /Users/siaosi/Projects/Sukut-Ecosystem/sukut-portal
npm install
npm run build
```

#### 2. Create S3 Bucket
```bash
# Create bucket (use unique name)
aws s3 mb s3://sukut-portal-production

# Enable static website hosting
aws s3 website s3://sukut-portal-production \
  --index-document index.html \
  --error-document index.html
```

#### 3. Create Bucket Policy
Create `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::sukut-portal-production/*"
    }
  ]
}
```

Apply the policy:
```bash
aws s3api put-bucket-policy \
  --bucket sukut-portal-production \
  --policy file://bucket-policy.json
```

#### 4. Upload Built Files
```bash
# Sync dist folder to S3
aws s3 sync dist/ s3://sukut-portal-production \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

# Upload index.html with no-cache
aws s3 cp dist/index.html s3://sukut-portal-production/index.html \
  --cache-control "no-cache, no-store, must-revalidate"
```

### Phase 2: CloudFront Setup

#### 1. Create CloudFront Distribution
```bash
# Create distribution configuration file
cat > cloudfront-config.json << EOF
{
  "CallerReference": "sukut-portal-$(date +%s)",
  "Comment": "Sukut Portal Distribution",
  "DefaultRootObject": "index.html",
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "S3-sukut-portal-production",
        "DomainName": "sukut-portal-production.s3-website-us-east-1.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
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
      "Cookies": {
        "Forward": "none"
      }
    },
    "TrustedSigners": {
      "Enabled": false,
      "Quantity": 0
    }
  },
  "CustomErrorResponses": {
    "Quantity": 1,
    "Items": [
      {
        "ErrorCode": 404,
        "ResponsePagePath": "/index.html",
        "ResponseCode": "200",
        "ErrorCachingMinTTL": 300
      }
    ]
  },
  "Enabled": true
}
EOF

# Create distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

#### 2. Get Your CloudFront URL
After creation, you'll receive a CloudFront domain like:
`d1234567890.cloudfront.net`

Your portal is now accessible at:
`https://d1234567890.cloudfront.net`

### Phase 3: Custom Domain (Optional)

#### 1. Register Domain in Route 53
```bash
# If you have a domain, create hosted zone
aws route53 create-hosted-zone \
  --name sukutportal.com \
  --caller-reference "$(date +%s)"
```

#### 2. Request SSL Certificate
```bash
# Request certificate (must be in us-east-1 for CloudFront)
aws acm request-certificate \
  --domain-name sukutportal.com \
  --subject-alternative-names "*.sukutportal.com" \
  --validation-method DNS \
  --region us-east-1
```

#### 3. Update CloudFront with Custom Domain
Update your CloudFront distribution to use the custom domain and SSL certificate.

## Connecting Other Apps

### Strategy 1: Subdomain Approach (Recommended)
Each app gets its own subdomain:
- `portal.sukutportal.com` - Main portal
- `timecard.sukutportal.com` - Timecard app
- `equipment.sukutportal.com` - Equipment app

### Strategy 2: Path-Based Routing
All apps under one domain:
- `sukutportal.com/` - Main portal
- `sukutportal.com/timecard` - Timecard app
- `sukutportal.com/equipment` - Equipment app

### Implementation Steps

#### 1. Deploy Each App to Separate S3 Buckets
```bash
# For each app
aws s3 mb s3://sukut-timecard-app
aws s3 mb s3://sukut-equipment-app
# ... repeat deployment steps for each
```

#### 2. Create CloudFront Distributions for Each
Each app gets its own CloudFront distribution.

#### 3. Update Portal Navigation
In your portal's `appConfig.ts`:
```typescript
export const externalApps = {
  timecard: {
    name: 'Timecard App',
    url: 'https://timecard.sukutportal.com',
    icon: Clock,
  },
  equipment: {
    name: 'Equipment Manager',
    url: 'https://equipment.sukutportal.com',
    icon: Truck,
  },
  // Add more apps as needed
};
```

#### 4. Implement Single Sign-On (SSO)
Share authentication between apps:
```typescript
// In each app, check for auth token
const authToken = localStorage.getItem('sukut_auth_token');
if (!authToken) {
  window.location.href = 'https://portal.sukutportal.com/login';
}
```

## Update & Maintenance Workflow

### Automated Deployment Script
Create `deploy.sh` in your project:
```bash
#!/bin/bash
set -e

echo "🏗️ Building Sukut Portal..."
npm run build

echo "🧪 Running tests..."
npm run test

echo "📦 Deploying to S3..."
aws s3 sync dist/ s3://sukut-portal-production \
  --delete \
  --cache-control "public, max-age=31536000" \
  --exclude "index.html"

aws s3 cp dist/index.html s3://sukut-portal-production/index.html \
  --cache-control "no-cache, no-store, must-revalidate"

echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id YOUR_DISTRIBUTION_ID \
  --paths "/*"

echo "✅ Deployment complete!"
```

Make it executable:
```bash
chmod +x deploy.sh
```

### Development to Production Workflow

#### 1. Local Development
```bash
# Make changes
npm run dev
# Test locally
```

#### 2. Commit Changes
```bash
git add .
git commit -m "Fix: Updated user authentication flow"
git push origin main
```

#### 3. Deploy to Staging (Optional)
```bash
# Deploy to staging bucket first
./deploy-staging.sh
# Test on staging URL
```

#### 4. Deploy to Production
```bash
./deploy.sh
```

### Rollback Strategy
```bash
# Keep previous builds
aws s3 sync dist/ s3://sukut-portal-production-backup-$(date +%Y%m%d)

# If needed, restore from backup
aws s3 sync s3://sukut-portal-production-backup-20240614/ s3://sukut-portal-production
```

## Best Practices

### 1. Environment Variables
Create `.env.production`:
```env
VITE_API_URL=https://api.sukutportal.com
VITE_AUTH_DOMAIN=sukutportal.com
```

### 2. GitHub Actions for CI/CD
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
    
    - name: Deploy to S3
      env:
        AWS_ACCESS_KEY_ID: ${{ secrets.AWS_ACCESS_KEY_ID }}
        AWS_SECRET_ACCESS_KEY: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
      run: |
        aws s3 sync dist/ s3://sukut-portal-production --delete
        aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_ID }} --paths "/*"
```

### 3. Monitoring & Alerts
- Set up CloudWatch alarms for errors
- Use AWS Cost Explorer to monitor spending
- Enable CloudFront access logs

### 4. Security Checklist
- [ ] Enable MFA on AWS root account
- [ ] Use IAM roles with minimal permissions
- [ ] Enable S3 bucket versioning
- [ ] Use HTTPS everywhere
- [ ] Implement proper CORS policies
- [ ] Regular security audits

## Cost Estimation
For a typical small-medium app:
- S3 Storage: ~$0.50/month
- CloudFront: ~$5-10/month
- Route 53: $0.50/month per hosted zone
- **Total**: ~$10-15/month

## Troubleshooting

### Common Issues

#### 1. 403 Forbidden Error
- Check S3 bucket policy
- Verify CloudFront origin settings

#### 2. React Router Not Working
- Ensure CloudFront custom error pages redirect 404 to index.html

#### 3. Cache Issues
- Invalidate CloudFront cache after deployments
- Use versioned file names for assets

## Next Steps
1. Start with manual deployment to understand the process
2. Set up staging environment
3. Implement CI/CD with GitHub Actions
4. Add monitoring and alerts
5. Plan for scaling (consider AWS Amplify for easier management)

## Resources
- [AWS S3 Static Website Hosting Guide](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [CloudFront Best Practices](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/BestPractices.html)
- [React Deployment Guide](https://create-react-app.dev/docs/deployment/)
- [AWS Free Tier](https://aws.amazon.com/free/)

---

Remember: Start simple, deploy often, and gradually add complexity as you become comfortable with AWS services.