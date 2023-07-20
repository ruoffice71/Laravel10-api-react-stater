<?php

namespace App\Http\Controllers\Api;

use App\Models\Post;
use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StorePostRequest;
use App\Http\Requests\UpdatePostRequest;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Resources\Json\AnonymousResourceCollection
     */
    public function index()
    {
        $auth_user_id = Auth::user()->id;
        return PostResource::collection(Post::query()->with('user')->where('user_id', $auth_user_id)->orderBy('id', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StorePostRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(StorePostRequest $request)
    {
        $data = $request->validated();
        $post = Post::create($data);

        return response(new PostResource($post) , 201);
    }

    /**
     * Display the specified resource.
     *
     * @param \App\Models\Post $post
     * @return \Illuminate\Http\Response
     */
    public function show(Post $post)
    {
        return new PostResource($post);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param \App\Http\Requests\UpdatePostRequest $request
     * @param \App\Models\Post                     $post
     * @return \Illuminate\Http\Response
     */
    public function update(UpdatePostRequest $request, Post $post)
    {
        $data = $request->validated();
        if (isset($data['password'])) {
            $data['password'] = bcrypt($data['password']);
        }
        $post->update($data);

        return new PostResource($post);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param \App\Models\Post $post
     * @return \Illuminate\Http\Response
     */
    public function destroy(Post $post)
    {
        $post->delete();

        return response("", 204);
    }
}
