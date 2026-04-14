import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Activity, Droplet } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function App() {
  const [pressure, setPressure] = useState(70);
  const [flow, setFlow] = useState(15);
  const [leak, setLeak] = useState(false);
  const [history, setHistory] = useState([]);

  const detectLeak = (p, f) => p < 65 || f > 22;

  useEffect(() => {
    const interval = setInterval(() => {
      const p = Math.floor(60 + Math.random() * 20);
      const f = Math.floor(10 + Math.random() * 15);
      const l = detectLeak(p, f);

      setPressure(p);
      setFlow(f);
      setLeak(l);

      setHistory((prev) => [
        { time: new Date().toLocaleTimeString(), pressure: p, flow: f },
        ...prev.slice(0, 19),
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Leak Detection Dashboard</h1>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className="text-xl font-semibold">
                {leak ? "Leak Detected" : "Normal"}
              </p>
            </div>
            <AlertTriangle className={leak ? "text-red-500" : "text-green-500"} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Pressure</p>
              <p className="text-xl font-semibold">{pressure} PSI</p>
            </div>
            <Activity />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex justify-between">
            <div>
              <p className="text-sm text-gray-500">Flow Rate</p>
              <p className="text-xl font-semibold">{flow} L/min</p>
            </div>
            <Droplet />
          </CardContent>
        </Card>
      </div>

      {/* Alert */}
      {leak && (
        <Card className="border-red-500">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertTriangle className="text-red-500" />
            <span className="text-red-600 font-medium">
              Leak detected! Immediate inspection required.
            </span>
          </CardContent>
        </Card>
      )}

      {/* Charts */}
      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">Pressure Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <XAxis dataKey="time" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="pressure" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-3">Flow Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={history}>
              <XAxis dataKey="time" hide />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="flow" stroke="#82ca9d" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Controls */}
      <Card>
        <CardContent className="p-4 flex justify-between">
          <span className="font-semibold">System Controls</span>
          <Button variant="outline">Configure</Button>
        </CardContent>
      </Card>
    </div>
  );
}

/*
SETUP NOTES (Production Ready)

1. Install deps:
   npm install lucide-react recharts
   npx shadcn-ui@latest init
   npx shadcn-ui@latest add card button

2. Replace simulation with backend:
   Use WebSocket (Socket.IO)

   useEffect(() => {
     socket.on("sensorData", (data) => {
       setPressure(data.pressure);
       setFlow(data.flow);
       setLeak(data.leak);
     });
   }, []);

3. Deploy:
   - Vercel / Netlify
*/