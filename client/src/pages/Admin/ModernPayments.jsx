import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  CreditCard, 
  DollarSign, 
  Search, 
  Calendar, 
  User, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Banknote, 
  Wallet, 
  ArrowUpRight, 
  FileText
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/Table";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/Select";
import { Badge } from "../../components/ui/Badge";
import { Progress } from "../../components/ui/Progress";
import { Calendar as CalendarComponent } from "../../components/ui/Calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../components/ui/Popover";
import { format } from "date-fns";
import { cn } from "../../lib/utils";
import api from '../../utils/api';

const fetchPayments = async () => {
  try {
    const response = await api.get('/admin/payments');
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching payments:", error);
    // Return empty array to avoid filter errors
    return [];
  }
};

const ModernPayments = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [date, setDate] = useState({
    from: undefined,
    to: undefined,
  });

  const { data: payments, isLoading, isError } = useQuery({ queryKey: ['payments'], queryFn: fetchPayments });

  // Make sure payments is always an array
  const paymentsArray = Array.isArray(payments) ? payments : [];

  const filteredPayments = paymentsArray.filter(payment => {
    // Safely access properties with optional chaining and provide fallbacks
    const id = payment?.id?.toString() || '';
    const transactionId = payment?.transactionId?.toString() || '';
    const username = payment?.user?.username || '';
    
    const matchesSearch = id.includes(searchText) ||
                         username.toLowerCase().includes(searchText.toLowerCase()) ||
                         transactionId.includes(searchText);
    
    const status = (payment?.status || '').toLowerCase();
    const matchesStatus = selectedStatus === 'all' || status === selectedStatus.toLowerCase();
    
    const paymentMethod = (payment?.paymentMethod || '').toLowerCase();
    const matchesMethod = selectedMethod === 'all' || paymentMethod === selectedMethod.toLowerCase();
    
    let matchesDateRange = true;
    if (date.from && date.to) {
      const paymentDate = new Date(payment.createdAt);
      matchesDateRange = paymentDate >= date.from && paymentDate <= date.to;
    }
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDateRange;
  });

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'default';
      case 'success': return 'default'; 
      case 'pending': return 'secondary';
      case 'processing': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  const getMethodIcon = (method) => {
    const methodLower = method?.toLowerCase() || '';
    if (methodLower.includes('credit') || methodLower.includes('card')) return <CreditCard className="h-4 w-4" />;
    if (methodLower.includes('bank') || methodLower.includes('transfer')) return <Banknote className="h-4 w-4" />;
    if (methodLower.includes('wallet') || methodLower.includes('paypal') || methodLower.includes('qris')) return <Wallet className="h-4 w-4" />;
    return <CreditCard className="h-4 w-4" />;
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Failed to load payments</h2>
        <p className="text-muted-foreground mb-4">
          There was an error loading the payment data.
        </p>
        <Button onClick={() => window.location.reload()}>
          Try again
        </Button>
      </div>
    );
  }

  const paymentStats = {
    total: paymentsArray.length,
    success: paymentsArray.filter(p => (p.status || '').toLowerCase() === 'completed' || (p.status || '').toLowerCase() === 'success').length,
    pending: paymentsArray.filter(p => (p.status || '').toLowerCase() === 'pending' || (p.status || '').toLowerCase() === 'processing').length,
    totalRevenue: paymentsArray
      .filter(p => (p.status || '').toLowerCase() === 'completed' || (p.status || '').toLowerCase() === 'success')
      .reduce((sum, p) => sum + (p.amount || 0), 0),
  };

  const methodStats = {
    credit_card: payments?.filter(p => p.paymentMethod === 'credit_card')?.length || 0,
    bank_transfer: payments?.filter(p => p.paymentMethod === 'bank_transfer')?.length || 0,
    e_wallet: payments?.filter(p => p.paymentMethod === 'e_wallet')?.length || 0,
    paypal: payments?.filter(p => p.paymentMethod === 'paypal')?.length || 0,
  };

  

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Payments</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Payments
            </CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Successful Payments
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentStats.success}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{paymentStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${paymentStats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Payment Methods Distribution</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex flex-col items-center">
            <Progress value={Math.round((methodStats.credit_card / payments?.length) * 100) || 0} className="w-[80px] h-[80px]" />
            <div className="mt-2 text-sm font-medium">Credit Card</div>
          </div>
          <div className="flex flex-col items-center">
            <Progress value={Math.round((methodStats.bank_transfer / payments?.length) * 100) || 0} className="w-[80px] h-[80px]" />
            <div className="mt-2 text-sm font-medium">Bank Transfer</div>
          </div>
          <div className="flex flex-col items-center">
            <Progress value={Math.round((methodStats.e_wallet / payments?.length) * 100) || 0} className="w-[80px] h-[80px]" />
            <div className="mt-2 text-sm font-medium">E-Wallet</div>
          </div>
          <div className="flex flex-col items-center">
            <Progress value={Math.round((methodStats.paypal / payments?.length) * 100) || 0} className="w-[80px] h-[80px]" />
            <div className="mt-2 text-sm font-medium">PayPal</div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Payments</CardTitle>
          <CardDescription>
            Manage your payment transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search payments..."
                className="w-full appearance-none bg-background pl-8 shadow-none"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select onValueChange={setSelectedStatus} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedMethod} defaultValue="all">
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Methods</SelectItem>
                  <SelectItem value="credit_card">Credit Card</SelectItem>
                  <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                  <SelectItem value="e_wallet">E-Wallet</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !date.from && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {date.from ? (
                      date.to ? (
                        <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>
                      ) : (
                        format(date.from, "LLL dd, y")
                      )
                    ) : (
                      <span>Pick a date range</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    initialFocus
                    mode="range"
                    defaultMonth={date.from}
                    selected={date}
                    onSelect={setDate}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button>
                <FileText className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment ID</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Method</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments?.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">#{payment.id}</TableCell>
                  <TableCell>TXN-{payment.transactionId}</TableCell>
                  <TableCell>
                    <div className="font-medium">{payment.user?.username}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {payment.user?.email}
                    </div>
                  </TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getMethodIcon(payment.paymentMethod)}
                      {payment.paymentMethod?.replace('_', ' ').toUpperCase()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(payment.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm">
                      View Details
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="text-xs text-muted-foreground">
            Showing <strong>1-10</strong> of <strong>{payments?.length}</strong> payments
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default ModernPayments;


