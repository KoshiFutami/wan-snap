import * as cdk from 'aws-cdk-lib';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class WanSnapInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    cdk.Tags.of(this).add('Project', 'wan-snap');

    // ── S3: 画像ストレージ ──────────────────────────────────────────────
    const imagesBucket = new s3.Bucket(this, 'ImagesBucket', {
      bucketName: `wan-snap-images-${this.account}-${this.region}`,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      encryption: s3.BucketEncryption.S3_MANAGED,
      versioned: false,
      cors: [
        {
          allowedOrigins: ['*'],
          allowedMethods: [s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedHeaders: ['*'],
          maxAge: 3000,
        },
      ],
      lifecycleRules: [
        {
          // 未使用のマルチパートアップロードを 7 日で削除
          abortIncompleteMultipartUploadAfter: cdk.Duration.days(7),
        },
      ],
      removalPolicy: cdk.RemovalPolicy.RETAIN,
    });

    // ── CloudFront: OAC 経由で S3 から配信 ────────────────────────────
    const distribution = new cloudfront.Distribution(this, 'ImagesDistribution', {
      defaultBehavior: {
        origin: origins.S3BucketOrigin.withOriginAccessControl(imagesBucket),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        allowedMethods: cloudfront.AllowedMethods.ALLOW_GET_HEAD,
        compress: true,
      },
      comment: 'wan-snap images CDN',
      priceClass: cloudfront.PriceClass.PRICE_CLASS_200,
    });

    // ── IAM: Railway API がアップロード/削除するためのユーザー ───────────
    const apiUser = new iam.User(this, 'ApiStorageUser', {
      userName: 'wan-snap-api-storage',
    });

    apiUser.addToPolicy(
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: ['s3:PutObject', 's3:DeleteObject', 's3:GetObject'],
        resources: [`${imagesBucket.bucketArn}/posts/*`],
      }),
    );

    // ── Outputs: Railway/Vercel の環境変数に設定する値 ─────────────────
    new cdk.CfnOutput(this, 'ImagesBucketName', {
      value: imagesBucket.bucketName,
      description: 'STORAGE_BUCKET_NAME に設定',
      exportName: 'WanSnapImagesBucketName',
    });

    new cdk.CfnOutput(this, 'CloudFrontUrl', {
      value: `https://${distribution.distributionDomainName}`,
      description: 'STORAGE_CDN_URL に設定',
      exportName: 'WanSnapCloudFrontUrl',
    });

    new cdk.CfnOutput(this, 'AWSRegion', {
      value: this.region,
      description: 'AWS_REGION / STORAGE_REGION に設定',
    });

    new cdk.CfnOutput(this, 'ApiStorageUserArn', {
      value: apiUser.userArn,
      description: 'IAM コンソールでこのユーザーのアクセスキーを発行する',
    });
  }
}
