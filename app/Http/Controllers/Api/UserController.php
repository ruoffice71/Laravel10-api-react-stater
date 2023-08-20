<?php

namespace App\Http\Controllers\Api;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Illuminate\Validation\Rules\Password;
use Auth;

class UserController extends Controller
{
    function __construct()
    {
        // dd($this->middleware('permission:users_list|users_create|users_update|users_delete', ['only' => ['index']]));
        $this->middleware('permission:users_list|users_create|users_update|users_delete', ['only' => ['index']]);
        $this->middleware('permission:users_create', ['only' => ['create','store']]);
        $this->middleware('permission:users_update', ['only' => ['edit','update']]);
        $this->middleware('permission:users_delete', ['only' => ['destroy']]);
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $user=Auth::user();
        $permissions = $user->getAllPermissions()->pluck('name')??[];
        $users=UserResource::collection(User::query()->orderBy('id', 'desc')->paginate(10));
        return ['permissions'=>$permissions, 'users'=>$users];
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StoreUserRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request,)
    {
        $request->validate(
            [
                'user.name' => 'required|string|max:55',
                'user.email' => 'required|email|unique:users,email',
                'user.password' => [
                    'required',
                    Password::min(8)
                        ->letters()
                        ->symbols(),
                ]
            ]
        );
        $data = $request->all();
        // return response()->json([
        //     'data'=>$data['user']['password'],
        //     // 'data'=>$data['checkBoxes']['checkBox1'],

        // ]);
        if (isset($data['user']['password'])) {
            $data['user']['password'] = bcrypt($data['user']['password']);
        }
        $user = User::create($data['user']);

        $permissions = [];
        foreach ($data['checkBoxes'] as $key => $value) {
            if ($value==true) {
                $permissions[]=$key;
            }
        }
        $user->givePermissionTo($permissions);

        return response(new UserResource($user) , 201);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdateUserRequest $request
     * @param \App\Models\User                     $user
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, User $user)
    {
        $data = $request->all();

        // return response()->json([
        //     // 'data'=>$data['user']['password'],
        //     // 'data'=>$data['checkBoxes']['users_list'],

        // ]);
        if (isset($data['user']['password'])) {
            $data['user']['password'] = bcrypt($data['user']['password']);
        }
        $user->update($data['user']);


        $permissions = [];
        foreach ($data['checkBoxes'] as $key => $value) {
            if ($value==true) {
                $permissions[]=$key;
            }
        }
        $user->syncPermissions($permissions);

        return new UserResource($user);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\User $user
     * @return \Illuminate\Http\Response
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response("", 204);
    }
}
