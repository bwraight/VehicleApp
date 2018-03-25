class App extends React.Component {
  constructor(props) {
      super(props);
      this.deleteVehicle = this.deleteVehicle.bind(this);
      this.rentVehicle = this.rentVehicle.bind(this);
      this.releaseVehicle = this.releaseVehicle.bind(this);
      this.createVehicle = this.createVehicle.bind(this);
      this.toggleGridRenderFalse = this.toggleGridRenderFalse.bind(this);
      this.state = {
          vehicles: [],
          customers: [],
          shouldGridRender: true
      };
   }

  componentDidMount() {
    this.loadCustomersFromServer();
    this.loadVehiclesFromServer();
  }

  toggleGridRenderFalse(){
    this.setState({
        shouldGridRender: false
    });
  }

  // Load vehicles from database
  loadVehiclesFromServer() {

      this.loadCustomersFromServer();

      fetch('http://localhost:8080/api/vehicles')
      .then((response) => response.json())
      .then((responseData) => {
          this.setState({
              vehicles: responseData._embedded.vehicles,
              shouldGridRender: true
          });
      });
  }

    // Load customers from database
    loadCustomersFromServer() {
        fetch('http://localhost:8080/api/customers')
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                customers: responseData._embedded.customers,
            });
        });
    }

  // Delete vehicle
  deleteVehicle(vehicle) {
      fetch (vehicle._links.self.href,
      { method: 'DELETE',})
      .then(
          res => this.loadVehiclesFromServer()
      )
      .catch( err => console.error(err))
  }

  // Rent vehicle
  //curl -i -X PUT -H "Content-Type:text/uri-list" -d "http://localhost:8080/api/Customers/1" http://localhost:8080/api/vehicles/1/customer
  rentVehicle(vehicle, customer) {
        fetch('http://localhost:8080/api/customers/search/findByEmail?email=' + customer)
        .then((response) => response.json())
        .then((responseData) => {
            fetch(vehicle._links.customer.href, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'text/uri-list',
                },
                body: responseData._links.self.href
            })
            .then(
                res => this.loadVehiclesFromServer()
            )
            .catch( err => console.error(err))
        });
   }

    // Release vehicle
      releaseVehicle(vehicle) {
       fetch (vehicle._links.customer.href,
             { method: 'DELETE',})
             .then(
                 res => this.loadVehiclesFromServer()
             )
             .catch( err => console.error(err))

             this.loadVehiclesFromServer();

      }

  // Create new vehicle
  createVehicle(vehicle) {
      fetch('http://localhost:8080/api/vehicles', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vehicle)
      })
      .then(
          res => this.loadVehiclesFromServer()
      )
      .catch( err => console.error(err))
  }

  render() {
    return (
       <div>
          <VehicleForm createVehicle={this.createVehicle}/>
          <VehicleTable deleteVehicle={this.deleteVehicle} rentVehicle={this.rentVehicle} releaseVehicle={this.releaseVehicle} toggleGridRenderFalse={this.toggleGridRenderFalse} vehicles={this.state.vehicles} customers={this.state.customers} shouldGridRender={this.state.shouldGridRender} />
       </div>
    );
  }
}

class VehicleTable extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
    var vehicles = this.props.vehicles.map(vehicle =>
        <Vehicle key={vehicle._links.self.href} vehicle={vehicle} customers={this.props.customers} deleteVehicle={this.props.deleteVehicle} rentVehicle={this.props.rentVehicle} releaseVehicle={this.props.releaseVehicle} shouldGridRender={this.props.shouldGridRender} toggleGridRenderFalse={this.props.toggleGridRenderFalse}/>
    );

    return (
      <div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Vehicle Type</th>
            <th>Make</th>
            <th>Model</th>
            <th>Number of Wheels</th>
            <th>Number of Passengers</th>
            <th>Rented by</th>
          </tr>
        </thead>
        <tbody>{vehicles}</tbody>
      </table>
      </div>);
  }
}

class Vehicle extends React.Component {
    constructor(props) {
        super(props);
        this.deleteVehicle = this.deleteVehicle.bind(this);
        this.rentVehicle = this.rentVehicle.bind(this);
        this.releaseVehicle = this.releaseVehicle.bind(this);
        this.loadRentalCustomer = this.loadRentalCustomer.bind(this);
        this.setupRentedBy = this.setupRentedBy.bind(this);
        this.setupButtons = this.setupButtons.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.toggleGridRenderFalse = this.toggleGridRenderFalse.bind(this);


        this.state = {
                  customer: {}
              };
    }

    handleChange(event) {
        console.log("NAME: " + event.target.name + " VALUE: " + event.target.value)
        this.setState(
            {[event.target.name]: event.target.value}
        );
    }

    deleteVehicle() {
        this.props.deleteVehicle(this.props.vehicle);
    }

    toggleGridRenderFalse() {
        this.props.toggleGridRenderFalse();
    }

    rentVehicle() {
        this.props.rentVehicle(this.props.vehicle, this.state.customer);
    }

    releaseVehicle() {
        this.props.releaseVehicle(this.props.vehicle);
    }

    loadRentalCustomer() {

        fetch(this.props.vehicle._links.customer.href)
        .then((response) => response.json())
        .then((responseData) => {
            this.setState({
                  customer: responseData,
            });
        })
        .catch(err => console.error(err),
                    this.setState({
                          customer: {},
                    })
                )

    }

    setupRentedBy(){

        if(this.state.customer.email != null){
            return (
                <div>{this.state.customer.email}</div>
            );
        }

        var customers = this.props.customers.map(customer =>
                        <option value={customer.id}>{customer.email}</option>
                    );

        return (
            <select className="custom-select my-1 mr-sm-2" id="customerSelect" name="customer" onChange={this.handleChange}>
                <option selected>Choose...</option>
                {customers}
            </select>
        );
    }

    setupButtons() {
        if(this.state.customer.email != null){
            return (
                <button className="btn btn-danger" onClick={this.releaseVehicle}>Release Rental</button>
            );
        }
        return (
            <div>
                <td>
                    <button className="btn btn-success" onClick={this.rentVehicle}>Rent</button>
                </td>
                <td>
                    <button className="btn btn-danger" onClick={this.deleteVehicle}>Delete</button>
                </td>
            </div>
        );
    }

    render() {
        if(this.props.shouldGridRender){
            this.loadRentalCustomer();
            this.toggleGridRenderFalse();
        }

        return (
          <tr>
            <td>{this.props.vehicle.vehicleType}</td>
            <td>{this.props.vehicle.make}</td>
            <td>{this.props.vehicle.model}</td>
            <td>{this.props.vehicle.numberOfWheels}</td>
            <td>{this.props.vehicle.numberOfPassengers}</td>
            <td>{this.setupRentedBy()}</td>
            <td>{this.setupButtons()}</td>
          </tr>
        );
    }
}

class VehicleForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleType: '',
            make: '',
            model: '',
            numberOfWheels: '',
            numberOfPassengers: ''
            };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        console.log("NAME: " + event.target.name + " VALUE: " + event.target.value)
        this.setState(
            {[event.target.name]: event.target.value}
        );
    }

    handleSubmit(event) {
        event.preventDefault();
        console.log("Make: " + this.state.make);
        var newVehicle = {  vehicleType: this.state.vehicleType,
                            make: this.state.make,
                            model: this.state.model,
                            numberOfWheels: this.state.numberOfWheels,
                            numberOfPassengers: this.state.numberOfPassengers
        };
        this.props.createVehicle(newVehicle);
    }

    render() {
        return (
            <div className="panel panel-default">
                <div className="panel-heading">Create vehicle</div>
                <div className="panel-body">
                <form className="form-inline">
                    <div className="col-md-2">
                        <select className="form-control" name="vehicleType" onChange={this.handleChange}>
                            <option selected>Vehicle Type...</option>
                            <option>CAR</option>
                            <option>MOTORBIKE</option>
                            <option>VAN</option>
                            <option>CONVERTABLE</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        <input type="text" placeholder="Make" className="form-control"  name="make" onChange={this.handleChange}/>
                    </div>
                    <div className="col-md-2">
                        <input type="text" placeholder="Model" className="form-control" name="model" onChange={this.handleChange}/>
                    </div>

                    <div className="col-md-2">
                        <input type="text" placeholder="Number of Wheels" className="form-control" name="numberOfWheels" onChange={this.handleChange}/>
                    </div>
                    <div className="col-md-2">
                        <input type="text" placeholder="Number of Passengers" className="form-control" name="numberOfPassengers" onChange={this.handleChange}/>
                    </div>

                    <div className="col-md-2">
                        <button className="btn btn-success" onClick={this.handleSubmit}>Save</button>
                    </div>
                </form>
                </div>
            </div>

        );
    }
}

ReactDOM.render(<App />, document.getElementById('root') );