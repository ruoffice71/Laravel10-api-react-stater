<?php

namespace App\Http\Controllers\Api;

use Image;
use App\Models\Post;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\PostResource;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\StorePostRequest;
use Illuminate\Support\Facades\Storage;
use App\Http\Requests\UpdatePostRequest;

class PostController extends Controller
{

    function __construct()
    {
        $this->middleware('permission:users_list|users_view|users_create|users_update|users_delete', ['only' => ['index']]);
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
        $auth_user_id = Auth::user()->id;
        return PostResource::collection(Post::query()->with('user')->where('user_id', $auth_user_id)->orderBy('id', 'desc')->paginate(10));
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param \App\Http\Requests\StorePostRequest $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $requestData = $request->all();
        $request->validate(
            [
                'user_id' => 'required',
                'title' => 'required|string|max:55',
                'details' => 'required',
                // the 'sometimes' rule indicates that the 'image' field should be validated only if it exists in the request
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]
        );
        // return response()->json([
        //     'data'=>$requestData,

        // ]);
        if ($request->hasFile('image')) {
            $requestData['image'] = $request->file('image')->store('posts', 'public');
            $setImage = 'storage/'.$requestData['image'];
            $img = Image::make($setImage)->resize(536, 376)->save($setImage);
        }
        $post = Post::create($requestData);

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
     * @param \App\Models\Post $post
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Post $post)
    {
        $requestData = $request->all();

        $request->validate(
            [
                'title' => 'required|string|max:55',
                'details' => 'required',
                // the 'sometimes' rule indicates that the 'image' field should be validated only if it exists in the request
                'image' => 'sometimes|image|mimes:jpeg,png,jpg,gif|max:2048',
            ]
        );


        // Retrieve the old image path
        $oldImagePath = $post->image;

        // return response()->json([
        //     'data'=>$oldImagePath,
        //     // 'data'=>Storage::exists($oldImagePath),
        // ]);

        // Delete the old image from storage if it exists
        if ($oldImagePath && Storage::exists($oldImagePath)) {
            Storage::delete($oldImagePath);
        }

        // Upload and save the new image
        if ($request->hasFile('image')) {
            $newImagePath = $request->file('image')->store('posts', 'public');
            $requestData['image']=$newImagePath;
        } else {
            $requestData['image']=$oldImagePath; // Keep the existing image if no new image is uploaded
        }


        // Update the record
        $post->update([
            'title'=>$requestData['title'],
            'details'=>$requestData['details'],
            'image'=>$requestData['image']
        ]);

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
