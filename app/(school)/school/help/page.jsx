// app/(help)/docs/api/page.jsx
'use client';

import { useState } from 'react';
import { Code, Copy, Check, Server, Key, Lock, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

const API_ENDPOINTS = [
    {
        method: "GET",
        path: "/api/auth/me",
        description: "Get current authenticated user information",
        auth: "Bearer token",
        response: `{
  "user": {
    "id": "string",
    "name": "string",
    "email": "string",
    "role": "admin | superadmin",
    "schoolId": "string"
  }
}`
    },
    {
        method: "POST",
        path: "/api/auth/login",
        description: "Authenticate user and get session token",
        auth: "None",
        body: `{
  "email": "string",
  "password": "string"
}`,
        response: `{
  "token": "string",
  "user": { ... }
}`
    },
    {
        method: "GET",
        path: "/api/schools",
        description: "Get list of schools (superadmin only)",
        auth: "Bearer token",
        response: `{
  "schools": [
    {
      "id": "string",
      "name": "string",
      "code": "string",
      "plan": "basic | professional | enterprise"
    }
  ]
}`
    },
    {
        method: "GET",
        path: "/api/students",
        description: "Get all students for the school",
        auth: "Bearer token",
        params: "?class=string&section=string",
        response: `{
  "students": [
    {
      "id": "string",
      "name": "string",
      "class": "string",
      "rollNumber": "number"
    }
  ]
}`
    },
    {
        method: "POST",
        path: "/api/attendance",
        description: "Mark attendance for students",
        auth: "Bearer token",
        body: `{
  "date": "2024-01-01",
  "class": "string",
  "attendance": [
    { "studentId": "string", "status": "present | absent | late" }
  ]
}`,
        response: `{
  "message": "Attendance recorded successfully"
}`
    },
    {
        method: "POST",
        path: "/api/emergency",
        description: "Trigger emergency alert",
        auth: "Bearer token",
        body: `{
  "type": "fire | medical | security | other",
  "location": "string",
  "message": "string"
}`,
        response: `{
  "alertId": "string",
  "status": "triggered"
}`
    }
];

function CodeBlock({ code, language = "json" }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative">
            <pre className="bg-gray-800 text-gray-100 p-4 rounded-md overflow-x-auto text-xs font-mono">
                <code>{code}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
            >
                {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} className="text-gray-400" />}
            </button>
        </div>
    );
}

function EndpointCard({ endpoint }) {
    const methodColors = {
        GET: "bg-emerald-50 text-emerald-700 border-emerald-200",
        POST: "bg-violet-50 text-violet-700 border-violet-200",
        PUT: "bg-amber-50 text-amber-700 border-amber-200",
        DELETE: "bg-rose-50 text-rose-700 border-rose-200",
    };

    return (
        <div className="border border-gray-200 rounded-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
                <div className="flex items-center gap-3 mb-2">
                    <span className={cn(
                        "px-2 py-0.5 rounded text-[11px] font-mono font-medium border",
                        methodColors[endpoint.method]
                    )}>
                        {endpoint.method}
                    </span>
                    <code className="text-sm text-gray-700 font-mono">{endpoint.path}</code>
                </div>
                <p className="text-sm text-gray-600">{endpoint.description}</p>
            </div>

            <div className="p-4 space-y-3">
                {endpoint.auth && (
                    <div>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1">
                            <Key size={12} /> Authentication
                        </div>
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{endpoint.auth}</code>
                    </div>
                )}

                {endpoint.params && (
                    <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Query Parameters</div>
                        <code className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md">{endpoint.params}</code>
                    </div>
                )}

                {endpoint.body && (
                    <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Request Body</div>
                        <CodeBlock code={endpoint.body} />
                    </div>
                )}

                {endpoint.response && (
                    <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">Response</div>
                        <CodeBlock code={endpoint.response} />
                    </div>
                )}
            </div>
        </div>
    );
}

export default function APIDocs() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <div className="mb-8">
                <div className="flex items-center gap-2 mb-2">
                    <Server className="w-6 h-6 text-violet-600" />
                    <h1 className="text-2xl font-semibold text-gray-800">API Reference</h1>
                </div>
                <p className="text-gray-600 text-sm">
                    The ResQID API allows you to programmatically access and manage your school data.
                    All endpoints require authentication using Bearer tokens.
                </p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-md p-4 mb-8">
                <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-violet-500 shrink-0 mt-0.5" />
                    <div>
                        <h3 className="font-medium text-gray-800 mb-1">Authentication Required</h3>
                        <p className="text-sm text-gray-600">
                            All API requests must include an Authorization header: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs font-mono">Authorization: Bearer your_token_here</code>
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Endpoints</h2>
                {API_ENDPOINTS.map((endpoint, idx) => (
                    <EndpointCard key={idx} endpoint={endpoint} />
                ))}
            </div>

            <div className="mt-8 p-5 bg-gray-50 border border-gray-200 rounded-md">
                <h3 className="font-medium text-gray-800 mb-2">Rate Limits</h3>
                <div className="flex items-center gap-5 text-sm text-gray-600">
                    <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-gray-500" />
                        <span>100 requests per minute</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Server size={14} className="text-gray-500" />
                        <span>1000 requests per hour</span>
                    </div>
                </div>
            </div>
        </div>
    );
}