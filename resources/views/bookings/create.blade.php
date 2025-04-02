<x-navbar />
<div class="container mx-auto mt-10">
    <h1 class="text-2xl font-bold text-center">Book Your Car</h1>
    <form method="POST" action="/bookings" class="max-w-lg mx-auto mt-6 bg-white p-6 shadow-md rounded-lg">
        @csrf
        <input type="hidden" name="car_id" value="{{ request('car_id') }}">
        <label class="block text-gray-700">Start Date</label>
        <input type="date" name="start_date" required class="w-full p-2 border rounded-md mt-1">

        <label class="block text-gray-700 mt-4">End Date</label>
        <input type="date" name="end_date" required class="w-full p-2 border rounded-md mt-1">

        <button class="bg-blue-500 text-white mt-4 w-full py-2 rounded">Proceed to Payment</button>
    </form>
</div>
