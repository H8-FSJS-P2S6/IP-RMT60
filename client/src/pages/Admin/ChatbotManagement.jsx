import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Bot, MessageSquare, TrendingUp, Users, RefreshCw, Activity, CheckCircle, XCircle } from "lucide-react";
import api from '../../utils/api';

export default function ChatbotManagement() {
  const [chatbotHealth, setChatbotHealth] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastChecked, setLastChecked] = useState(null);

  const checkChatbotHealth = async () => {
    setLoading(true);
    try {
      const response = await api.get('/chatbot/health');
      setChatbotHealth(response.data);
      setLastChecked(new Date());
    } catch (err) {
      console.error('Chatbot health check failed:', err);
      setChatbotHealth({ 
        status: 'error', 
        service: 'SNS Chatbot',
        message: 'Service unavailable',
        timestamp: new Date().toISOString()
      });
      setLastChecked(new Date());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkChatbotHealth();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'healthy': return 'Sehat';
      case 'error': return 'Error';
      default: return 'Unknown';
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Chatbot Management</h1>
          <p className="text-gray-600 mt-2">Monitor and manage SNS Assistant AI Chatbot</p>
        </div>
        <Button onClick={checkChatbotHealth} disabled={loading} className="flex items-center gap-2">
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh Status
        </Button>
      </div>

      {/* Chatbot Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chatbot Status</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${getStatusColor(chatbotHealth?.status)} animate-pulse`}></div>
              <span className="text-2xl font-bold">
                {chatbotHealth ? getStatusText(chatbotHealth.status) : 'Loading...'}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {lastChecked ? `Last checked: ${lastChecked.toLocaleTimeString('en-US')}` : 'Not checked yet'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">AI Service</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Gemini 2.0</div>
            <p className="text-xs text-muted-foreground">Google AI Platform</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Knowledge Base</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Updated</div>
            <p className="text-xs text-muted-foreground">Course & pricing info</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">~2s</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>
      </div>

      {/* Chatbot Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              Informasi Chatbot
            </CardTitle>
            <CardDescription>
              Detail konfigurasi dan kemampuan SNS Assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Nama Assistant:</span>
                <Badge variant="secondary">SNS Assistant</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bahasa:</span>
                <Badge variant="secondary">Bahasa Indonesia</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Model AI:</span>
                <Badge variant="secondary">Gemini 2.0 Flash</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Knowledge Base:</span>
                <Badge variant="secondary">Real-time Course Data</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Kemampuan Chatbot
            </CardTitle>
            <CardDescription>
              Fitur dan layanan yang dapat diberikan oleh chatbot
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                'Informasi kursus NDT lengkap',
                'Harga dan paket pelatihan',
                'Jadwal dan ketersediaan',
                'Proses pendaftaran',
                'Sertifikasi ASNT Level III',
                'Kategori teknik NDT',
                'Rekomendasi kursus',
                'Bantuan umum akademi'
              ].map((capability, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">{capability}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Test Chat Interface */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            Test Chatbot
          </CardTitle>
          <CardDescription>
            Uji coba langsung kemampuan chatbot dari panel admin
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 text-center">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-4">
              Untuk menguji chatbot, silakan buka halaman utama website dan klik tombol chat di pojok kanan bawah.
            </p>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Contoh pertanyaan untuk testing:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  "Berapa harga kursus UT?",
                  "Apa saja kategori kursus NDT?",
                  "Bagaimana cara daftar?",
                  "Siapa instruktur kami?"
                ].map((question, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    "{question}"
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Logs and Analytics placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Analytics & Logs
          </CardTitle>
          <CardDescription>
            Statistik penggunaan chatbot (Coming Soon)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600 mb-2">Fitur Analytics Segera Hadir</p>
            <p className="text-sm text-gray-500">
              Akan menampilkan statistik percakapan, pertanyaan populer, dan performa chatbot
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
