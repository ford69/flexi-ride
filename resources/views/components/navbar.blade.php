<nav class="bg-gray-100 text-white shadow-lg">
    <div class="container mx-auto px-6 py-4 flex justify-between items-center">
        <!-- Logo -->
        <a href="/" class="text-2xl font-bold tracking-wide text-blue-400 hover:text-blue-500 transition">
            Car Rental
        </a>

        <!-- Mobile Menu Button -->
        <button id="menu-toggle" class="md:hidden text-gray-300 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
        </button>

        <!-- Menu -->
        <div id="nav-links" class="hidden md:flex space-x-6">
            <a href="/" class="text-black hover:text-gray-400 transition">Home</a>
            <a href="/cars" class="text-black hover:text-gray-400 transition">Browse Cars</a>
            <a href="/about" class="text-black hover:text-gray-400 transition">About Us</a>
            <a href="/contact" class="text-black hover:text-gray-400 transition">Contact</a>
        </div>

        <!-- Authentication Links -->
        <div class="hidden md:flex space-x-4">
            <a href="/login" class="bg-orange-400 px-4 py-2 rounded-full text-white hover:from-red-600">Login</a>
            <a href="/register" class="bg-cyan-200 px-4 py-2 rounded-full text-white hover:from-blue-400">Register</a>
        </div>
    </div>

    <!-- Mobile Menu -->
    <div id="mobile-menu" class="hidden md:hidden bg-gray-800 text-center py-4">
        <a href="/" class="block py-2 hover:bg-gray-700">Home</a>
        <a href="/cars" class="block py-2 hover:bg-gray-700">Browse Cars</a>
        <a href="/about" class="block py-2 hover:bg-gray-700">About Us</a>
        <a href="/contact" class="block py-2 hover:bg-gray-700">Contact</a>
        <a href="/login" class="block py-2 bg-blue-500 hover:bg-blue-600 rounded">Login</a>
        <a href="/register" class="block py-2 bg-gray-700 hover:bg-gray-800 rounded">Register</a>
    </div>
</nav>

<!-- Toggle Script -->
<script>
    document.getElementById('menu-toggle').addEventListener('click', function () {
        document.getElementById('mobile-menu').classList.toggle('hidden');
    });
</script>
