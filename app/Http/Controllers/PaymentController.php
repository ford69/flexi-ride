<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function pay(Request $request)
    {
        $booking = Booking::findOrFail($request->booking_id);

        $payment = Payment::create([
            'booking_id' => $booking->id,
            'amount' => $booking->total_price,
            'status' => 'pending',
        ]);

        $data = [
            'amount' => $payment->amount * 100, // Convert to kobo
            'email' => $request->user()->email,
            'reference' => Paystack::genTranxRef(),
            'currency' => 'NGN',
            'callback_url' => route('payment.callback'),
        ];

        return Paystack::getAuthorizationUrl($data)->redirectNow();
    }

    public function callback()
    {
        $paymentDetails = Paystack::getPaymentData();

        if ($paymentDetails['status'] === 'success') {
            Payment::where('reference', $paymentDetails['data']['reference'])->update(['status' => 'successful']);
            return response()->json(['message' => 'Payment successful']);
        } else {
            return response()->json(['message' => 'Payment failed'], 400);
        }
    }
}
