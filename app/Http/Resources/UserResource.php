<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public static $wrap = false;

    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array|\Illuminate\Contracts\Support\Arrayable|\JsonSerializable
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'roles' => $this->roles->pluck('name')??[],
            'roles.permission' => $this->getPermissionsViaRoles()->pluck('name')??[],
            'permissions' => $this->permissions->pluck('name')??[],
            'token' => $this->createToken("Token")->plainTextToken,
            'created_at' => $this->created_at->format('Y-m-d H:i:s'),

        ];
    }
}
