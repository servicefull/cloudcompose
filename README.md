## cloudCompose

An open comunity marketplace for serverless workflows.

http://cloudcompose.io

The cloudCompose platform is built on the premise of building a community of serverless functions, services and workflows. By installing the command line tool locally, users can contribute their services to the marketplace with ease. In adition, by using the deployment feature within the marketplace, users can send any service directly to their own AWS environment with a single-click.

## Contents

* [Installation](#installation)
* [Requirements](#requirements)
* [Commands](#commands)
* [Customization](#customization)
* [Deployments](#deployments)
* [Contributions](#contributions)

## <a name="installation"></a>Installation

The cloudCompose tool is available on NPM, and should be installed globally.
```bash
npm install cloudcompose -g
```

## <a name="requirements"></a>Requirements

Lambda functions: cloudCompose services consist mainly of serverless lambda functions for use in Amazon Web Services.
Serverless.yml: cloudCompose is built onto of the Serverless Framework, the leading framework for developing and deploying serverless applications to the cloud. In order to use our tool, you must also have the serverless framework installed.
```bash
npm install serverless -g
```

All service deployments require a serverless.yml file in order to be consumed by the cloudCompose tool. Serverless.yml files instruct the framework on how your application should be configured within your cloud account.

For more information on how to configure a serverless.yml file, head over to the docs on serverless.com.

## <a name="commands"></a>Commands

### Initialize:

In order to use the tool, you must first register as a user, login and find your access key on your user profile page. This will give you access to add services to the marketplace. Once you have your access key:
```bash
cloudcompose init
```

You will then be prompted to enter your access key. If you wish to override your access, you can use the —force flag, and you will be prompted to enter a new one.

### Up:

The UP command will send your service up to the cloudCompose service marketplace, where it can be deployed by all other user. In order to add your service you must provide a valid path to a directory containing your lambda functions and your serverless.yml. If no path is supplied the tool will use the current path inside of your terminal window.
```bash
cloudcompose up  — path ~/path/to/your/service
```

## <a name="customization"></a>Customization

### README:

The tool allows for README.md support. If a README exists in your directory path, this file will also be added to your service and viewable by everyone in the marketplace.

###  Package.json:

If you have a package.json file present in your directory path, the tool will look for two things. It will extract the description if it is present, as well all of the keywords that exists within the file.

## <a name="deployments"></a>Deployments

cloudCompose deployments are handle from the application at http://cloudCompose.io. In order to deploy service to your AWS account you must first be a registered user of cloudCompose. Once logged, visit your profile page, and supply your AWS Access Key and Secret. You can also supply a default region to use for your deployments. Once you deploy a service, you can visit the “My Deployments” page to view the status of your deployment.

## <a name="contributions"></a>Contributions

cloudCompose is in beta, and that means there are many features and enhancements planned for the future. It also means we are actively open for any and all feedback to help improve the tool, as well as suggestions for improvement.

Now, go build!
