# libraryApplicationSpringAndReact

Prequisities:

1. Java 11 with Spring Boot
2. MySQL Database configured with data (login and password) contained in the configuration file (application.properties)
3. Other dependencies located in the file with extension .mvn (Hibernate etc.).

Basic version of library simulation application with borrowing simulator included.
Components needed for data initialization are placed in a folder src\main\java\com\example\library\runners.

Accounts secured with an encrypted password.

Limit of 3 owned books per user. The number of queues the user can belong to is unlimited at the moment.

Two types of accounts:

1. reader - can only borrow and return books
2. librarian - can borrow and return books, assign them to other users and remove users.
