import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { Stage } from 'aws-cdk-lib'
import { PollogramFastifyCdkStack } from './pollogram-fastify-cdk-stack'

export class PollogramFastifyAppStages extends Stage {
  constructor(scope: Construct, id: string, props?: cdk.StageProps) {
    super(scope, id, props)

    new PollogramFastifyCdkStack(this, 'PollogramFastifyAppStack')
  }
}
