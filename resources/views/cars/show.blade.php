<x-navbar />
<div class="container mx-auto mt-10">
    <div class="flex flex-col md:flex-row gap-6">
        <img src="{{ $car->image_url }}" class="w-full md:w-1/2 h-60 object-cover rounded-lg">
        <div>
            <h1 class="text-3xl font-bold">{{ $car->brand }} {{ $car->model }}</h1>
            <p class="text-gray-500 mt-2">GHS {{ $car->price_per_day }} per day</p>
            <p class="mt-4">{{ $car->description }}</p>
            <a href="/bookings/create?car_id={{ $car->id }}" class="block bg-blue-500 text-white mt-3 py-2 text-center rounded">Book Now</a>
        </div>
    </div>
</div>
