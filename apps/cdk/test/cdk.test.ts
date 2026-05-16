import * as cdk from 'aws-cdk-lib';
import { Match, Template } from 'aws-cdk-lib/assertions';
import { WanSnapInfrastructureStack } from '../lib/cdk-stack';

describe('WanSnapInfrastructureStack', () => {
  it('synthesizes a CloudFormation template', () => {
    const app = new cdk.App();
    const stack = new WanSnapInfrastructureStack(app, 'TestStack');

    const template = Template.fromStack(stack);

    expect(template.toJSON()).toHaveProperty('Parameters');
  });

  it('grants the API storage user access to all image prefixes', () => {
    const app = new cdk.App();
    const stack = new WanSnapInfrastructureStack(app, 'TestStack');

    const template = Template.fromStack(stack);

    template.hasResourceProperties('AWS::IAM::Policy', {
      PolicyDocument: {
        Statement: [
          {
            Action: ['s3:PutObject', 's3:DeleteObject', 's3:GetObject'],
            Effect: 'Allow',
            Resource: [
              Match.objectLike({
                'Fn::Join': [
                  '',
                  [
                    Match.anyValue(),
                    '/posts/*',
                  ],
                ],
              }),
              Match.objectLike({
                'Fn::Join': [
                  '',
                  [
                    Match.anyValue(),
                    '/avatars/*',
                  ],
                ],
              }),
              Match.objectLike({
                'Fn::Join': [
                  '',
                  [
                    Match.anyValue(),
                    '/dogs/*',
                  ],
                ],
              }),
            ],
          },
        ],
      },
    });
  });
});
