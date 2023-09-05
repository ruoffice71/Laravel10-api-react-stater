<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePostRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules()
    {
        // $data = $this->all();
        // dump($data);
        return [
            'user_id' => 'required',
            'title' => 'required|string|max:55',
            'details' => 'required',
            'image' => 'image|mimes:jpeg,png,jpg|max:2048',
            // Example validation for image upload
        ];
    }

    // Optionally, you can customize error messages
    public function messages()
    {
        return [
            'title.required' => 'The title field is required.',
            'image.mimes' => 'The image must be a file of type: jpeg, png, jpg.',
            // Add more custom messages as needed
        ];
    }
}
