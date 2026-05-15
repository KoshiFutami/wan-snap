import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';

export class WanSnapInfrastructureStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    cdk.Tags.of(this).add('Project', 'wan-snap');
  }
}
