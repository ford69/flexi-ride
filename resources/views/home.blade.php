
<x-app-layout>

<!-- Hero Section -->
<section class="relative bg-cover bg-center h-[400px] flex items-center text-white" style="background-image: url('{{ asset('img/car-rental.jpg') }}');">
    <div class="bg-black bg-opacity-50 w-full h-full flex flex-col justify-center px-8 lg:px-16">
        <div class="max-w-lg">
            <h1 class="text-4xl font-bold">Find the Perfect Car for Your Trip</h1>
            <p class="text-lg text-gray-300 mt-2">Explore our wide range of rental cars at affordable prices.</p>

        </div>
    </div>
</section>

<!-- Form Card Overlapping the Next Section -->
<div class="relative flex justify-end">
    <div class="absolute -top-80 right-20 bg-white shadow-lg rounded-lg p-6 w-full max-w-md">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Book a Car</h2>
        <form>
            <div class="mb-3">
                <label class="block text-gray-700 font-semibold mb-1">Select Type Of Car</label>
                <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter Car Type">
            </div>
            <div class="mb-3">
                <label class="block text-gray-700 font-semibold mb-1">Select Destination</label>
                <input type="text" class="w-full p-2 border rounded-md" placeholder="Enter destination">
            </div>
            <div class="grid grid-cols-2 gap-3">
                <div>
                    <label class="block text-gray-700 font-semibold mb-1">Pick-up Date</label>
                    <input type="date" class="w-full p-2 border rounded-md">
                </div>
                <div>
                    <label class="block text-gray-700 font-semibold mb-1">Pick-up Time</label>
                    <input type="time" class="w-full p-2 border rounded-md">
                </div>
            </div>
            <button type="submit" class="mt-4 w-full px-6 py-3 bg-orange-400 text-white rounded-md text-lg hover:bg-blue-300 transition">
                Browse Cars
            </button>
        </form>
    </div>
</div>


<!-- Benefits Section -->
<section class="bg-gray-100 py-12 px-6 text-center">
    <h2 class="text-3xl font-bold text-gray-800">Find Great Deals for Car Rental</h2>
    <p class="text-gray-600 mt-2">We have great offers for daily, weekly, and long-term rentals.</p>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 shadow-lg rounded-lg">
            <div class="text-3xl text-yellow-500">&#10003;</div>
            <h3 class="text-lg font-semibold mt-2">Flexible Booking Process</h3>
            <p class="text-gray-600 mt-2">Book with a small down payment and pay the rest upon pickup.</p>
        </div>
        <div class="bg-white p-6 shadow-lg rounded-lg">
            <div class="text-3xl text-yellow-500">&#10003;</div>
            <h3 class="text-lg font-semibold mt-2">Free Extras & Cancellation</h3>
            <p class="text-gray-600 mt-2">Cancel or modify your booking for free up to 48 hours before rental.</p>
        </div>
        <div class="bg-white p-6 shadow-lg rounded-lg">
            <div class="text-3xl text-yellow-500">&#10003;</div>
            <h3 class="text-lg font-semibold mt-2">Quality & Expertise</h3>
            <p class="text-gray-600 mt-2">We evaluate our partners to ensure the best service.</p>
        </div>
    </div>
</section>

<section class="py-12 bg-gray-100">
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Top Hire Cars</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <img src="{{ asset('img/ADDY-1.jpg') }}" alt="" class="w-full h-48 object-cover">
                <div class="p-4">
                    <p class="text-gray-600 text-sm"></p>
                    <h3 class="text-lg font-semibold text-blue-600"></h3>

                    <div class="flex items-center justify-between mt-3 text-gray-700">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm"> Seats</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm"></span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm"> Doors</span>
                        </div>
                    </div>

                    <p class="text-green-500 font-bold mt-3">from ₵400 /day</p>

                    <a href="" class="block mt-4 px-4 py-2 bg-red-500 text-white text-center rounded-md hover:bg-blue-600 transition">
                        View Details
                    </a>
                </div>
            </div>

        </div>

    </div>
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Top Hire Cars</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <img src="{{ asset('img/ADDY-1.jpg') }}" alt="" class="w-full h-48 object-cover">
                <div class="p-4">
                    <p class="text-gray-600 text-sm"></p>
                    <h3 class="text-lg font-semibold text-blue-600"></h3>

                    <div class="flex items-center justify-between mt-3 text-gray-700">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm"> Seats</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm"></span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm"> Doors</span>
                        </div>
                    </div>

                    <p class="text-green-500 font-bold mt-3">from ₵400 /day</p>

                    <a href="" class="block mt-4 px-4 py-2 bg-red-500 text-white text-center rounded-md hover:bg-blue-600 transition">
                        View Details
                    </a>
                </div>
            </div>

        </div>

    </div>
    <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-8">Top Hire Cars</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <div class="bg-white shadow-md rounded-lg overflow-hidden">
                <img src="{{ asset('img/ADDY-1.jpg') }}" alt="" class="w-full h-48 object-cover">
                <div class="p-4">
                    <p class="text-gray-600 text-sm"></p>
                    <h3 class="text-lg font-semibold text-blue-600"></h3>

                    <div class="flex items-center justify-between mt-3 text-gray-700">
                        <div class="flex items-center space-x-2">
                            <span class="text-sm"> Seats</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm"></span>
                        </div>
                        <div class="flex items-center space-x-2">
                            <span class="text-sm"> Doors</span>
                        </div>
                    </div>

                    <p class="text-green-500 font-bold mt-3">from ₵400 /day</p>

                    <a href="" class="block mt-4 px-4 py-2 bg-red-500 text-white text-center rounded-md hover:bg-blue-600 transition">
                        View Details
                    </a>
                </div>
            </div>

        </div>

    </div>
</section>


<!-- Customer Reviews -->
<section class="py-12 px-6 text-center">
    <h2 class="text-3xl font-bold text-gray-800">Highly Recommended by Our Customers</h2>
    <p class="text-gray-600 mt-2">Excellent ratings based on thousands of reviews.</p>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        <div class="bg-white p-4 shadow-lg rounded-lg">
            <p class="text-green-500 text-2xl">★★★★★</p>
            <p class="text-gray-700 mt-2">"Easy to book, lots of options!"</p>
            <p class="text-gray-500 text-sm">- Narayan Rao</p>
        </div>
        <div class="bg-white p-4 shadow-lg rounded-lg">
            <p class="text-green-500 text-2xl">★★★★★</p>
            <p class="text-gray-700 mt-2">"Quick and easy process."</p>
            <p class="text-gray-500 text-sm">- Jacqueline Heynes</p>
        </div>
        <div class="bg-white p-4 shadow-lg rounded-lg">
            <p class="text-green-500 text-2xl">★★★★★</p>
            <p class="text-gray-700 mt-2">"Great vehicle selection!"</p>
            <p class="text-gray-500 text-sm">- Kevin Wyatt</p>
        </div>
        <div class="bg-white p-4 shadow-lg rounded-lg">
            <p class="text-green-500 text-2xl">★★★★★</p>
            <p class="text-gray-700 mt-2">"Very convenient and affordable."</p>
            <p class="text-gray-500 text-sm">- Philip</p>
        </div>
    </div>
</section>

<!-- Car Listings -->
<div id="cars" class="container mx-auto mt-12 px-6">
    <h2 class="text-3xl font-bold text-center text-gray-800">Available Cars</h2>
    <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        @foreach ($cars as $car)
            <div class="bg-white p-4 shadow-lg rounded-lg transform hover:scale-105 transition duration-300">
                <img src="{{ $car->image_url }}" alt="Car Image" class="w-full h-48 object-cover rounded-md">
                <h3 class="text-lg font-semibold mt-2 text-gray-800">{{ $car->brand }} {{ $car->model }}</h3>
                <p class="text-gray-500">GHS {{ number_format($car->price_per_day, 2) }} per day</p>
                <a href="/cars/{{ $car->id }}" class="block bg-blue-500 text-white mt-4 py-2 text-center rounded hover:bg-blue-600 transition">
                    View Details
                </a>
            </div>
        @endforeach
    </div>
</div>

<!-- Footer -->
<footer class="bg-gray-900 text-white text-center py-4 mt-12">
    <p>&copy; {{ date('Y') }} Car Rental. All rights reserved.</p>
</footer>

</x-app-layout>

