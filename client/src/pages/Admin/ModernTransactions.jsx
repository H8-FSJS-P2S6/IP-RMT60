import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  ShoppingBag, 
  DollarSign, 
  Search, 
  Calendar, 
  User, 
  BookOpen, 
  CreditCard, 
  CheckCircle, 
  Clock, 
  XCircle, 
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
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover";
import { Calendar as CalendarComponent } from "@/components/ui/Calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import api from '../../utils/api';

const fetchTransactions = async () => {
  try {
    const response = await api.get('/admin/transactions');
    return response.data; // Return the data directly
  } catch (error) {
    console.error("Error fetching transactions:", error);
    // Return empty array to avoid filter errors
    return [];
  }
};

const exportTransactions = async () => {
  try {
    const response = await api.get('/admin/transactions/export');
    return response.data;
  } catch (error) {
    console.error("Error exporting transactions:", error);
    throw error;
  }
};

const ModernTransactions = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDateRange, setSelectedDateRange] = useState({
    from: undefined,
    to: undefined,
  });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);

  const { data: transactions, isLoading, isError } = useQuery({ queryKey: ['transactions'], queryFn: fetchTransactions });

  const exportMutation = useMutation({
    mutationFn: exportTransactions,
    onSuccess: (data) => {
      // Create blob and download
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
    },
    onError: (error) => {
      console.error('Export failed:', error);
      alert('Failed to export transactions. Please try again.');
    }
  });

  // Make sure transactions is always an array even when it's undefined or null
  const transactionsArray = Array.isArray(transactions) ? transactions : [];
  
  const filteredTransactions = transactionsArray.filter(transaction => {
    // Safely access properties with optional chaining and provide fallbacks
    const id = transaction?.id?.toString() || '';
    const username = transaction?.user?.username || transaction?.User?.username || '';
    const email = transaction?.user?.email || transaction?.User?.email || '';
    
    const matchesSearch = id.includes(searchText) ||
                         username.toLowerCase().includes(searchText.toLowerCase()) ||
                         email.toLowerCase().includes(searchText.toLowerCase());
    
    const status = (transaction?.status || '').toLowerCase();
    const matchesStatus = selectedStatus === 'all' || status === selectedStatus.toLowerCase();
    
    let matchesDateRange = true;
    if (selectedDateRange.from && selectedDateRange.to) {
      const transactionDate = new Date(transaction.createdAt);
      matchesDateRange = transactionDate >= selectedDateRange.from && transactionDate <= selectedDateRange.to;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const handleViewDetails = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailModalVisible(true);
  };

  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'default';
      case 'pending': return 'secondary';
      case 'failed': return 'destructive';
      case 'cancelled': return 'outline';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <FileText className="h-16 w-16 text-gray-400 mb-4" />
        <h2 className="text-2xl font-semibold mb-2">Failed to load transactions</h2>
        <p className="text-muted-foreground mb-4">
          There was an error loading the transaction data. This might be because the transaction
          service is not yet fully implemented.
        </p>
        <div className="flex gap-2">
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const transactionStats = {
    total: transactionsArray.length,
    completed: transactionsArray.filter(t => (t.status || '').toLowerCase() === 'completed').length,
    pending: transactionsArray.filter(t => (t.status || '').toLowerCase() === 'pending').length,
    totalRevenue: transactionsArray
      .filter(t => (t.status || '').toLowerCase() === 'completed')
      .reduce((sum, t) => sum + (t.total || t.total_amount || 0), 0),
  };

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Transactions
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionStats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Completed Transactions
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionStats.completed}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Transactions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactionStats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${transactionStats.totalRevenue.toFixed(2)}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Monitor and manage all transactions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="relative w-1/3">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions..."
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
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[240px] justify-start text-left font-normal",
                      !selectedDateRange.from && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDateRange.from ? (
                      selectedDateRange.to ? (
                        <>{format(selectedDateRange.from, "LLL dd, y")} - {format(selectedDateRange.to, "LLL dd, y")}</>
                      ) : (
                        format(selectedDateRange.from, "LLL dd, y")
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
                    defaultMonth={selectedDateRange.from}
                    selected={selectedDateRange}
                    onSelect={setSelectedDateRange}
                    numberOfMonths={2}
                  />
                </PopoverContent>
              </Popover>
              <Button 
                onClick={() => exportMutation.mutate()}
                disabled={exportMutation.isPending}
              >
                <FileText className="h-4 w-4 mr-2" />
                {exportMutation.isPending ? 'Exporting...' : 'Export'}
              </Button>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">#{transaction.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{transaction.user?.username || transaction.User?.username}</div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {transaction.user?.email || transaction.User?.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    {transaction.items?.slice(0, 2).map((item, index) => (
                      <div key={index} className="text-sm">
                        <BookOpen className="inline-block h-3 w-3 mr-1" /> {item.lecture?.title}
                      </div>
                    ))}
                    {transaction.items?.length > 2 && (
                      <div className="text-xs text-muted-foreground">
                        +{transaction.items.length - 2} more items
                      </div>
                    )}
                  </TableCell>
                  <TableCell>${transaction.total || transaction.total_amount || 0}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(transaction.status)}>
                      {transaction.status || 'Unknown'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      {transaction.paymentMethod || transaction.payment_method || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>{new Date(transaction.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={() => handleViewDetails(transaction)}>
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
            Showing <strong>1-{Math.min(filteredTransactions.length, 10)}</strong> of <strong>{filteredTransactions.length}</strong> transactions
          </div>
        </CardFooter>
      </Card>

      <Dialog open={isDetailModalVisible && selectedTransaction} onOpenChange={setIsDetailModalVisible}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              Transaction Details - #{selectedTransaction?.id || 'Loading...'}
            </DialogTitle>
            <DialogDescription>
              Detailed information about this transaction.
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Transaction Information</h4>
                  <div className="grid gap-1">
                    <div><strong>Transaction ID:</strong> #{selectedTransaction.id}</div>
                    <div><strong>Status:</strong> <Badge variant={getStatusVariant(selectedTransaction.status)}>{selectedTransaction.status || 'Unknown'}</Badge></div>
                    <div><strong>Customer:</strong> {selectedTransaction.user?.username || selectedTransaction.User?.username || 'N/A'} ({selectedTransaction.user?.email || selectedTransaction.User?.email || 'N/A'})</div>
                    <div><strong>Total Amount:</strong> ${selectedTransaction.total || selectedTransaction.total_amount || 0}</div>
                    <div><strong>Payment Method:</strong> {selectedTransaction.paymentMethod || selectedTransaction.payment_method || 'N/A'}</div>
                    <div><strong>Date:</strong> {selectedTransaction.createdAt ? new Date(selectedTransaction.createdAt).toLocaleString() : 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Items</h4>
                  <div className="grid gap-2">
                    {selectedTransaction.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center border-b pb-2 last:border-b-0 last:pb-0">
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4" />
                          <span>{item.lecture?.title}</span>
                        </div>
                        <span>${item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModernTransactions;
