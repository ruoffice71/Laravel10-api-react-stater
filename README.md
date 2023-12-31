# Laravel React Example Full Stack Application
Example Application build with Laravel and React

> The repo was created while I was working on the following [YouTube tutorial](https://youtu.be/qJq9ZMB2Was)

## Demo
https://laravel-react.com


## Installation 
Make sure you have environment setup properly. You will need PHP8.1, composer and Node.js.

1. Download the project (or clone using GIT)
2. Copy `.env.example` into `.env` and configure database credentials
3. Navigate to the project's root directory using terminal
4. Run `composer install`
5. Set the encryption key by executing `php artisan key:generate --ansi`
6. Run migrations `php artisan migrate --seed`
7. Start local server by executing `php artisan serve`
8. Open new terminal and navigate to the `react` folder
9. Copy `react/.env.example` into `.env` and adjust the `VITE_API_BASE_URL` parameter
9. Run `npm install`
10. Run `npm run dev` to start vite server for React


## Backend Installation With Laravel Api
1) D:\Installed\laragon\www\Study\laravel-react-starter\app\Http\Kernel.php

```bash
'api' => [
            // \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
            'throttle:api',
            \Illuminate\Routing\Middleware\SubstituteBindings::class,
        ],
```


2) D:\Installed\laragon\www\Study\laravel-react-starter\app\Http\Middleware\RedirectIfAuthenticated.php

```bash
/**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @param  string|null  ...$guards
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
*/
```

3) D:\Installed\laragon\www\Study\laravel-react-starter\app\Providers\AuthServiceProvider.php

```bash
/**
     * Register any authentication / authorization services.
     *
     * @return void
     */
    public function boot()
    {
        $this->registerPolicies();
    }
```

## The Directory And Files Need To Create

1) D:\Installed\laragon\www\Study\laravel-react-starter\app\Http\Controllers\Api

2) D:\Installed\laragon\www\Study\laravel-react-starter\app\Http\Requests

3) D:\Installed\laragon\www\Study\laravel-react-starter\app\Http\Resources

4) D:\Installed\laragon\www\Study\laravel-react-starter\routes\api.php


## Frontend Installation With React Js Vite
D:\Installed\laragon\www\Study\laravel-react-starter\react


## Frontend Screenshots
Url: http://localhost:3000/login

![Laravel10ApiReactStater Sign In](https://github.com/ruoffice71/Laravel10-api-react-stater/blob/main/README/Screenshots/1.png)


Url: http://localhost:3000/signup

![Laravel10ApiReactStater Sign Up](https://github.com/ruoffice71/Laravel10-api-react-stater/blob/main/README/Screenshots/2.png)


Url: http://localhost:3000/users

![Laravel10ApiReactStater Users](https://github.com/ruoffice71/Laravel10-api-react-stater/blob/main/README/Screenshots/3.png)


Url: http://localhost:3000/users/new

![Laravel10ApiReactStater Add New User Form](https://github.com/ruoffice71/Laravel10-api-react-stater/blob/main/README/Screenshots/4.png)


Url: http://localhost:3000/posts/new

![Laravel10ApiReactStater Add New Post Form](https://github.com/ruoffice71/Laravel10-api-react-stater/blob/main/README/Screenshots/5.png)
