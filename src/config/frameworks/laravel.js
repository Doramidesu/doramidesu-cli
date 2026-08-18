module.exports = {
  name: "Laravel",

  requirements: [
    {
      command: "php -v",
      label: "PHP",
    },
    {
      command: "composer --version",
      label: "Composer",
    },
  ],

  installer: "composer create-project laravel/laravel",

  database: {
    driver: "mysql",
    defaults: {
      host: "127.0.0.1",
      port: 3306,
      username: "root",
    },
  },

  nextSteps: {
    commands: ["php artisan serve"],
    url: "http://127.0.0.1:8000",
  },
};
