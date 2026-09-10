# Service Directory front-end

This is the front-end for the Service Directory, which has replaced the [WASP Marketplace](https://wasp.test.icelab.cloud/marketplace) that was a portlet in Liferay. It has a [corresponding back-end](https://git.icelab.cloud/wasp/service-directory-api).

It is written in [Angular](https://angular.io), in [TypeScript](https://www.typescriptlang.org/). CSS/TypeScript code is formatted with [Prettier](https://prettier.io/) and the CSS is based on [Bootstrap](https://getbootstrap.com). It is Dockerised on ICE’s GitLab registry and deployed on the [test server](https://orchestration-test.icelab.cloud/service-directory) and [production server](https://orchestration.icelab.cloud/service-directory).

The Service Directory holds services that were in the old Marketplace, including the [Service API](https://git.icelab.cloud/wasp/service-api). Users are able to see/add/edit/delete their own services. Every service is [OpenAPI](https://www.openapis.org/)-compliant, and the Service Directory back-end is too.

OpenAPI services (such as the Service Directory holds) are described by OpenAPI specifications. A section of specification that can be included in more than one OpenAPI specification is called a “common definition”. If a service requires authentication, that information is called a “security definition”. The Service Directory allows users to see — and edit — services, specifications, common definitions, and security definitions.

The back-end includes some support for “single endpoints”, which are like services but without OpenAPI. This front-end doesn’t have that, and probably never will.

For a list of validation rules on the services, see Issue [service-directory-api#8](https://git.icelab.cloud/wasp/service-directory-api/-/issues/8).

_For more documentation about specific components, see the [/documentation](./documentation/architecture.md) folder._

## Notes on terminology

In the old Marketplace, OpenAPI services were called “external marketplaces” and single endpoints were called “services”. Both could be added into “categories”, and categories also could be nested in other categories. We don’t have the categories functionality in the Service Directory.

Files named “\*\*.service.ts” are used by Angular to keep business logic for modules, and by Nest.js to keep business logic for controllers. This results in us having files such as `src/app/services/services-service/services.service.ts` for classes such as `ServicesService`, which is a service that handles services in the Service Directory. Don’t get confused!

## API Gateway

The src/app/gateway folder contains components (and other classes) made for the “API Gateway”, adapted from Jose’s [api-gateway-frontend](https://git.icelab.cloud/wasp/api-gateway-frontend) repo. This adds authentication information (security definitions) to the services, and has [its own back-end](https://git.icelab.cloud/wasp/api-gateway).

Components and other classes that are not related to security definitions are in the src/app/services folder.

## Note on observables

Most of the components use observables; the components unsubscribe from these when they dismount. Issue #26 explains.

## How to run

You’ll usually want to be running the [back-end](https://git.icelab.cloud/wasp/service-directory-api) at the same time, and probably the [API Gateway back-end](https://git.icelab.cloud/wasp/api-gateway) too.

### Running outside of Docker

For development:

```bash
npm start
```

which is an alias of:

```bash
ng serve --port 4203 --open
```

The local server will restart whenever you save a file.

## Unit tests

Run `ng test` or `npm test` to run the unit tests.
These use [Jasmine](https://jasmine.github.io) and [Karma](https://karma-runner.github.io), running in [Puppeteer](https://pptr.dev/).

## Deployment (including locally in Docker)

Run the build script in the root folder.

```bash
.\build.ps1
```

Follow the instructions the script gives you, such as for selecting a target server.

### Remote deployment

If you select a non-local server, the script will push to the Docker registry in GitLab for you.
Then, assuming you have a VPN connection and SSH credentials, refresh the entire Service Directory on the server.
(Do this in a separate terminal.)

```bash
ssh root@192.168.50.220
cd /opt/orchestration/service-directory
docker-compose pull
docker-compose up -d
```

That’s the IP address for the test server.
The production server is on 192.168.50.221.

If you’re not logged into Docker locally, or nobody is logged in on the server, you’ll be prompted to log in.

```bash
docker login git.icelab.cloud -u {YourGitLabUN} -p {YourGitLabPW}
```

### Old commands for local deployment

If you don’t want to use the build script, but you still want to build this project for production and serve it at http://localhost:2503/, you can run:

```bash
npm run prod
docker run -it --rm -p 2503:80 service-directory
```

Feel free to use a port other than 2503 if you wish.
You can also do `docker-compose up`.

### Old deployment commands

In the root directory:

- Ensure you’re logged into GitLab using your user-name and password.
- Build the Angular project.
- Build the Docker image, with a tag.
- Then upload to the Docker registry on ICE’s GitLab server.

```bash
docker login git.icelab.cloud -u {YourGitLabUN} -p {YourGitLabPW}
npm run prod
docker build -t git.icelab.cloud/wasp/deployment/orchestration-test/service-directory:latest ./
docker image push git.icelab.cloud/wasp/deployment/orchestration-test/service-directory:latest
```

Then, assuming you have a VPN connection and SSH credentials for the test server, refresh the entire Service Directory on the test server. (Do this in a separate terminal.)

```bash
ssh root@192.168.50.220
cd /opt/orchestration/service-directory
docker login git.icelab.cloud -u {YourGitLabUN} -p {YourGitLabPW}
docker-compose pull
docker-compose up -d
```

The same commands and Docker tag apply to the production server, with 192.168.50.221 for the IP address.

### Extra commands for the server

You might not need to run these.

#### Image maintenance

To save space, you may need to delete any obsolete images:

```bash
docker rmi $(docker images | grep 'service-directory')
```

(This actually tries to delete all images with names containing “service-directory”. It succeeds for unused images, but gives error-messages for images that are in use, which is fine.)

The `grep` command works on Linux, but not Windows.

#### Checking Docker containers

To see the list of running containers (which should include service-directory:latest):

```bash
docker ps
```

## Default readme from Angular

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 13.2.5.

### Development server

Run `ng serve` for a dev server. Navigate to `[http://localhost:<del>4200</del><ins>4203</ins>/](http://localhost:4203)`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

