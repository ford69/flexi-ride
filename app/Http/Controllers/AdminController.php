<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    //
    public function approveCar($id)
    {
        $car = Car::findOrFail($id);
        $car->update(['status' => 'approved']);

        return response()->json(['message' => 'Car approved']);
    }

    public function rejectCar($id)
    {
        $car = Car::findOrFail($id);
        $car->delete();

        return response()->json(['message' => 'Car rejected']);
    }
}
