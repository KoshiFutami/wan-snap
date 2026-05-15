import * as cdk from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { WanSnapInfrastructureStack } from '../lib/cdk-stack';

describe('WanSnapInfrastructureStack', () => {
  it('synthesizes a CloudFormation template', () => {
    const app = new cdk.App();
    const stack = new WanSnapInfrastructureStack(app, 'TestStack');

    const template = Template.fromStack(stack);

    expect(template.toJSON()).toHaveProperty('Parameters');
  });
});
