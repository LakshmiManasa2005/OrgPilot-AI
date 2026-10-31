function DashboardCard({ title, value, icon }) {
  return (
    <div className="card">
      <h3>
        {icon} {title}
      </h3>

      <h1>{value}</h1>
    </div>
  );
}

export default DashboardCard;

//this is 1 page. 
//this is page 2.
