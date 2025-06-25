export default function Contact() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="prose max-w-none">
        <p className="text-lg mb-4">
          Get in touch with our team for support and inquiries.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-semibold mb-3">General Inquiries</h3>
            <p>Email: info@leadapps.io</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-3">Student Support</h3>
            <p>Email: support@leadapps.io</p>
            <p>Phone: +1 (555) 987-6543</p>
          </div>
        </div>
      </div>
    </div>
  );
}