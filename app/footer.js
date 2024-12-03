// components/Footer.js
const Footer = () => {
  return (
    <footer className="bg-gray-300 text-gray-800 p-4 text-left relative w-full">
      <div className="flex justify-between items-center">
        <p className="text-lg font-bold m-0">Contact</p>
        <div className="flex gap-5 items-center">
          <div className="text-2xl cursor-pointer">
            <i className="fas fa-phone" title="Tel: 081-882-5679"></i>
          </div>
          <div className="text-2xl cursor-pointer">
            <i className="fas fa-envelope" title="Email: itawclinic@gmail.com"></i>
          </div>
          <div className="text-2xl cursor-pointer">
            <i className="fab fa-line" title="Line: itawcli67"></i>
          </div>
        </div>
      </div>

      {/* Add FontAwesome for icons */}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
    </footer>
  );
};

export default Footer;
