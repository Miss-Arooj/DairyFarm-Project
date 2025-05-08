const AdminOrders = () => {
    const [orders, setOrders] = useState([]);
  
    useEffect(() => {
      const fetchOrders = async () => {
        const res = await axios.get('/api/orders');
        setOrders(res.data);
      };
      fetchOrders();
    }, []);
  
    return (
      <div className="p-4">
        <h2>Recent Orders</h2>
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Items</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order.customer.name}</td>
                <td><a href={`tel:${order.customer.phone}`}>{order.customer.phone}</a></td>
                <td>
                  {order.items.map(item => (
                    <div key={item.productId}>
                      {item.quantity}x {item.productId}
                    </div>
                  ))}
                </td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };