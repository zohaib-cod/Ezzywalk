"use server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function createOrder(orderData) {
  try {
    const session = await getServerSession(authOptions);
    
    if (session && session.user) {
      orderData.userId = session.user.id;
    }

    const headers = {
      'Content-Type': 'application/json',
    };
    if (session && session.user.backendToken) {
      headers['Authorization'] = `Bearer ${session.user.backendToken}`;
    }

    const res = await fetch('http://127.0.0.1:5000/api/orders', {
      method: 'POST',
      headers,
      body: JSON.stringify(orderData)
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Failed to create order:", errorText);
      throw new Error(`Order creation failed: ${errorText}`);
    }
    
    return await res.json();
  } catch (e) {
    console.error(e);
    throw e;
  }
}
