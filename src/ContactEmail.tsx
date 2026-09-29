import { useState } from "react";

// The contact email, split into base64 pieces so it never appears in plain
// text in the source or the built bundle (keeps naive scrapers away).
const EMAIL_PIECES = [
  "b3BpbWFzaW4udGE=",
  "cGlvY2E5NzJAc2k=",
  "bXBsZWxvZ2luLmNvbQ==",
];

/** A "Show contact email" link that reveals the address only once clicked. */
function ContactEmail() {
  const [email, setEmail] = useState<string | null>(null);

  if (email) {
    return (
      <span className="text-sm ">
        contact : <span className=" select-all">{email}</span>
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() =>
        setEmail(EMAIL_PIECES.map((piece) => atob(piece)).join(""))
      }
      className="text-xs text-blue-700 underline hover:text-blue-800"
    >
      show contact email
    </button>
  );
}

export default ContactEmail;
