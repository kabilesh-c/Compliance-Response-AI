import { NextRequest, NextResponse } from "next/server";

const mockUsers = [
  // Retail Users
  { id: "1", email: "admin@pharmacy.com", password: "admin123", name: "Admin User", role: "ADMIN", mode: "RETAIL" },
  { id: "2", email: "manager@pharmacy.com", password: "manager123", name: "Manager User", role: "MANAGER", mode: "RETAIL" },
  { id: "3", email: "pharmacist@pharmacy.com", password: "pharmacist123", name: "Pharmacist User", role: "PHARMACIST", mode: "RETAIL" },
  
  // Hospital Users
  { id: "4", email: "admin@hospital.com", password: "admin123", name: "Hospital Admin", role: "ADMIN", mode: "HOSPITAL" },
  { id: "5", email: "manager@hospital.com", password: "manager123", name: "Pharmacy Manager", role: "MANAGER", mode: "HOSPITAL" },
  { id: "6", email: "staff@hospital.com", password: "staff123", name: "Dept Staff", role: "PHARMACIST", mode: "HOSPITAL" },
];

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const user = mockUsers.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 401 }
      );
    }

    const token = `mock-jwt-token-${user.id}`;
    const { password: _, ...userWithoutPassword } = user;

    return NextResponse.json({
      token,
      user: userWithoutPassword,
      mode: user.mode || "RETAIL"
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
