<?php

namespace App\Http\Controllers;

use App\Models\Car;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class CarController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // List all approved cars
        $cars = Car::where('status', 'approved')->get();
        return view('home', compact('cars'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'brand' => 'required',
            'model' => 'required',
            'year' => 'required|integer',
            'price_per_day' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $car = Car::create([
            'car_owner_id' => Auth::id(),
            'brand' => $request->brand,
            'model' => $request->model,
            'year' => $request->year,
            'price_per_day' => $request->price_per_day,
            'status' => 'pending', // Requires admin approval
        ]);

        return response()->json(['message' => 'Car submitted for approval', 'car' => $car]);
    }

    public function show($id)
    {
        $car = Car::findOrFail($id);
        return response()->json($car);
    }
}
