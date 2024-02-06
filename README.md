# Doceipt

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.2.4.

## Deploy APIs from Docker Hub

1. Install docker and docker-compose. Follow official documentation from docker.
2. Open a terminal and login to docker. Using your docker password works, however, I advise you create a token on hub.docker.com and use that instead since docker stores your password unencrypted on your computer (./docker/config.json)

   ```cmd
   $ docker login [options] --username <YOUR_USERNAME>
   $ Password: <YOUR_DOCKER_ACCOUNT_TOKEN>

   Options:
   IMAGE_REGISTRY_URL e.g. iocr.fra.com; if not set, image is pulled from docker hub registry
   ```

3. Download the *scripts-dockerhub* folder.

4. Override the default appsettings.docker.json file in the image by updating the *appsettings.docker.json* file in the *scripts-dockerhub* sub-folders
In the example below, the file **scripts-dockerhub/appsettings.docker.json** on my computer will be copied over to the docker environment replacing the **/app/appsettings.docker.json**

   ```yml
      volumes:
         - ./appsettings.docker.json:/app/appsettings.docker.json
   ```

5. Start Authserver by running docker-compose from the dir *scripts-dockerhub/authserver/*

   ```cmd
   scripts-dockerhub/authserver$ docker-compose up
   ```

6. Start Invoicing API and Service MQ by running docker-compose from the dir *scripts-dockerhub/invoicing/*

   ```cmd
   scripts-dockerhub/invoicing$ docker-compose run start-dependencies
   
   Starting scripts_rabbitmq_1 ... done
   Waiting for rabbitmq to listen on 5672...

   scripts-dockerhub/invoicing$ docker-compose up
   ```

7. Test the AuthServer, Invoicing API and Service MQ are running by visiting *http://\<IP_ADDRESS\>:5000*, *http://\<IP_ADDRESS\>:5050*, and *http://\<IP_ADDRESS\>:5040* respectively.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Slow Loading Test

Build the project with below command:
`ng build --prod --aot --common-chunk --delete-output-path --buildOptimizer --sourceMap=true`

Run `npm i source-map-explorer`
Run `source-map-explorer dist/my-awesome-project/main.js` to view the packages slowing down you app

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

### Syncfusion:

`https://www.syncfusion.com/blogs/post/create-stock-charts-using-syncfusion-angular-charts.aspx`
`https://ej2.syncfusion.com/angular/documentation/chart/getting-started/`
`https://www.syncfusion.com/forums/151958/ejs-chart-giving-error`

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
"# InvoicingUI" 
