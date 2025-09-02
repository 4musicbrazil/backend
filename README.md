# **TEMPLATE BACKEND**
This project provides a base setup for Node.js applications, including Docker configuration and a local database setup.

![image](https://github.com/Akag-Digital/template-project-nestjs/assets/83480339/fd874e6d-76b3-41e2-a62c-ea2ea35aea47)


### **Requirements** 

#### - Docker version 23.0.1, build a5ee5b1 or a local database setup

#### - docker-compose version 1.29.2, build unknown

#### - Node.js v16.14.0

#### - yarn 1.22.19

#

## **Getting Started**

### **Configuration**

1 - Create a new folder named `vars` in the project root.

2 - Copy the `.example.env` file to the vars folder and rename it to .`development.env`.

3 - Set the appropriate values for the environment variables in the .development.env file.

4 - Set api version in .`development.env`.

5 - Set api name in .`development.env`.

6 - Set api year in .`development.env`.

#

### **Database Setup**

Running with Docker

4 - Run the following command:

```bash
$ docker-compose --env-file ./vars/.development.env up -d
```

Running Locally

5 - Use a local database server of your choice.

#### Starting the Application

To start the application, run the following command:

```bash
$ yarn start:dev
```

#### Migrations

##### Create a new migration
```bash
$ npx typeorm-ts-node-commonjs migration:create src/database/migrations/{name-you-migrate}
```

##### Run migration
```bash
$ yarn migrate:run
```

##### Revert migration
```bash
$ yarn migrate:revert
```

#### Guards and JWT Authentication

Within the controller application, we have an example of using guards for routes and JWT login, which can be used to protect routes and define access rules.

##### Example Guard Jwt and Roles to protected you routes
```js
@ApiTags('Users') // Use this decoration for show in swagger documentation
@ApiBearerAuth()// User this decoration for use JWT authentication with Bearer authentication
@Controller('users')
export class UsersController {
    @Get(':userUuid')
    @Roles(Role.ADMIN) // Use this decoration for define access rules
    @UseGuards(JwtAuthGuard, RolesGuard) // Use this decoration for define guards for you routes
    findOne(@Param('userUuid') userUuid: string) {
        return this.usersService.findOne(userUuid);
    }
}
```
## Documentation

### **To access the project documentation, visit http://localhost:{PORT}/docs in your web browser.**
# backend
