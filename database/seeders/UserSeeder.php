<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //create few permission
        $user_list = Permission::create(['name' => 'users_list']);
        $user_view = Permission::create(['name' => 'users_view']);
        $user_create = Permission::create(['name' => 'users_create']);
        $user_update = Permission::create(['name' => 'users_update']);
        $user_delete = Permission::create(['name' => 'users_delete']);


        // ...............................................................
        // admin section
        // ...............................................................

        // create a role for admin_user
        $admin_role = Role::create(['name' => 'admin']);

        // assign some permission through a role
        $admin_role->givePermissionTo([
            $user_list,
            $user_view,
            $user_create,
            $user_update,
            $user_delete,
        ]);

        // create a admin_user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@gmail.com',
            'password' => bcrypt('12345678')
        ]);
        // assign a role to the admin_user
        $admin->assignRole($admin_role);
        // assign some direct permission to the admin_user
        $admin->givePermissionTo([
            $user_list,
            $user_view,
            $user_create,
            $user_update,
            $user_delete,
        ]);

        // ...............................................................
        // user section
        // ...............................................................

        // create a role for general_user
        $user_role = Role::create(['name' => 'user']);

        // assign some permission through a role
        $user_role->givePermissionTo([
            $user_list,
        ]);

        // create a general_user
        $user = User::create([
            'name' => 'User',
            'email' => 'user@gmail.com',
            'password' => bcrypt('12345678')
        ]);
        // assign a role to the general_user
        $user->assignRole($user_role);
        // assign some direct permission to the general_user
        // $user->givePermissionTo([
        //     $user_list,
        // ]);
    }
}
