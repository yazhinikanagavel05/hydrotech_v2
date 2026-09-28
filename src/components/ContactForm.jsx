import { useState, useRef, useEffect, useId } from "react";
import { AlertCircle, CheckCircle2, Loader2, Send, Info } from "lucide-react";

import Button from "./Button.jsx";
import { applicationOptions, cropOptions } from "../data/applications.js";
import { phoneNumbers, email } from "../data/site.js";

/**
 * Enquiry form.
 *
 * There is NO backend in this build. Submitting runs local validation and then
 * shows a success panel that explains how to reach HydroTech directly. Nothing
 * is transmitted, stored or emailed — the form does not pretend otherwise.
 *
 * TO CONNECT A BACKEND: replace the `simulateSend` call with a real request,
 * set the `status` to "sending", and map the response to "success"/"error".
 */
const initialValues = {
  name: "",
  phone: "",
  location: "",
  application: "",
  crop: "",
  area: "",
  message: "",
  contactPref: "Phone",
};

const contactPreferences = ["Phone", "Email"];

/** Indian mobile numbers are 10 digits starting 6-9; landlines are allowed too. */
function isValidPhone(value) {
  const digits = value.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 13;
}

async function simulateSend() {
  // Stands in for a POST to a form endpoint. Intentionally short so the state
  // change is visible without feeling broken.
  await new Promise((r) => setTimeout(r, 900));
}

export default function ContactForm() {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const formRef = useRef(null);
  const successRef = useRef(null);
  const uid = useId();

  useEffect(() => {
    if (status === "success") successRef.current?.focus();
  }, [status]);

  const set = (key) => (e) => {
    const { value } = e.target;
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((err) => ({ ...err, [key]: undefined }));
  };

  const validate = () => {
    const next = {};
    if (!values.name.trim()) next.name = "Please tell us your name.";
    if (!values.phone.trim()) next.phone = "A phone number helps us call you back quickly.";
    else if (!isValidPhone(values.phone)) next.phone = "Please check the phone number.";
    if (!values.location.trim()) next.location = "Where is the land located?";
    if (!values.application) next.application = "Please choose the closest option.";
    if (values.message.trim().length < 10)
      next.message = "A little more detail helps us suggest the right system.";
    return next;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length) {
      const first = formRef.current?.querySelector('[aria-invalid="true"]');
      first?.focus();
      return;
    }
    setStatus("sending");
    try {
      await simulateSend();
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div className="formstatus formstatus--ok" role="status" tabIndex={-1} ref={successRef}>
        <span className="formstatus__icon">
          <CheckCircle2 size={24} aria-hidden="true" />
        </span>
        <h3>Thank you — your details are ready to send</h3>
        <p>
          This website version does not have a form server connected, so nothing was sent
          automatically. Please call or email us and we will get back to you.
        </p>
        <p style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
          {phoneNumbers.map((p) => (
            <a key={p.tel} href={`tel:${p.tel}`} className="btn btn--primary btn--sm">
              Call {p.display}
            </a>
          ))}
          <a href={email.mailto} className="btn btn--ghost btn--sm">
            Email HydroTech
          </a>
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="btn--sm"
          onClick={() => {
            setValues(initialValues);
            setStatus("idle");
          }}
        >
          Write another enquiry
        </Button>
      </div>
    );
  }

  const field = (key, label, hint, children, span) => (
    <div className="field" style={span ? { gridColumn: "1 / -1" } : undefined}>
      <label className="field__label" htmlFor={`${uid}-${key}`}>
        {label}
        <span className="field__req" aria-hidden="true">
          *
        </span>
        {hint && <span>({hint})</span>}
      </label>
      {children}
      {errors[key] && (
        <span className="field__err" id={`${uid}-${key}-err`} role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          {errors[key]}
        </span>
      )}
    </div>
  );

  const invalid = (key) => errors[key] !== undefined;

  return (
    <form className="form" ref={formRef} onSubmit={onSubmit} noValidate>
      <div className="stack" style={{ "--gap": "6px" }}>
        <h2 className="t-h3">Send an irrigation enquiry</h2>
        <p style={{ fontSize: "0.92rem", color: "var(--muted)" }}>
          The more you tell us about your crop and land, the more useful our reply will be.
        </p>
      </div>

      {status === "error" && (
        <div className="formstatus formstatus--err" role="alert">
          <span className="formstatus__icon">
            <AlertCircle size={24} aria-hidden="true" />
          </span>
          <h3>Something went wrong</h3>
          <p>
            The enquiry could not be prepared. Please try again, or call us directly on{" "}
            <a href={`tel:${phoneNumbers[0].tel}`} style={{ textDecoration: "underline" }}>
              {phoneNumbers[0].display}
            </a>
            .
          </p>
        </div>
      )}

      <div className="form__row">
        {field(
          "name",
          "Your name",
          null,
          <input
            id={`${uid}-name`}
            className="input"
            type="text"
            name="name"
            autoComplete="name"
            placeholder="e.g. Kumar"
            value={values.name}
            onChange={set("name")}
            aria-invalid={invalid("name")}
            aria-describedby={errors.name ? `${uid}-name-err` : undefined}
            required
          />
        )}

        {field(
          "phone",
          "Phone number",
          null,
          <input
            id={`${uid}-phone`}
            className="input"
            type="tel"
            name="phone"
            inputMode="tel"
            autoComplete="tel"
            placeholder="e.g. 98765 43210"
            value={values.phone}
            onChange={set("phone")}
            aria-invalid={invalid("phone")}
            aria-describedby={errors.phone ? `${uid}-phone-err` : undefined}
            required
          />
        )}

        {field(
          "location",
          "Location of your land",
          "village / taluk / district",
          <input
            id={`${uid}-location`}
            className="input"
            type="text"
            name="location"
            autoComplete="address-level2"
            placeholder="e.g. Puliyur, Karur"
            value={values.location}
            onChange={set("location")}
            aria-invalid={invalid("location")}
            aria-describedby={errors.location ? `${uid}-location-err` : undefined}
            required
          />
        )}

        {field(
          "area",
          "Area to be irrigated",
          "optional — in acres or hectares",
          <input
            id={`${uid}-area`}
            className="input"
            type="text"
            name="area"
            placeholder="e.g. 2 acres"
            value={values.area}
            onChange={set("area")}
          />
        )}

        {field(
          "application",
          "What is this for?",
          null,
          <select
            id={`${uid}-application`}
            className="select"
            name="application"
            value={values.application}
            onChange={set("application")}
            aria-invalid={invalid("application")}
            aria-describedby={errors.application ? `${uid}-application-err` : undefined}
            required
          >
            <option value="">Select an option…</option>
            {applicationOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}

        {field(
          "crop",
          "Crop",
          "optional",
          <select
            id={`${uid}-crop`}
            className="select"
            name="crop"
            value={values.crop}
            onChange={set("crop")}
          >
            <option value="">Select a crop…</option>
            {cropOptions.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        )}

        {field(
          "message",
          "What would you like to irrigate?",
          null,
          <textarea
            id={`${uid}-message`}
            className="textarea"
            name="message"
            rows={5}
            placeholder="Tell us about the crop, how the land is planted, and where the water comes from."
            value={values.message}
            onChange={set("message")}
            aria-invalid={invalid("message")}
            aria-describedby={errors.message ? `${uid}-message-err` : undefined}
            required
          />,
          true
        )}
      </div>

      <div className="field">
        <span className="field__label" id={`${uid}-pref-label`}>
          How should we reply?
        </span>
        <div className="pills" role="radiogroup" aria-labelledby={`${uid}-pref-label`}>
          {contactPreferences.map((pref) => (
            <label className="pill" key={pref}>
              <input
                type="radio"
                name="contactPref"
                value={pref}
                checked={values.contactPref === pref}
                onChange={set("contactPref")}
              />
              <span>{pref}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="form__foot">
        <Button type="submit" variant="primary" size="lg" icon={Send} disabled={status === "sending"}>
          {status === "sending" ? "Preparing…" : "Send enquiry"}
        </Button>
        {status === "sending" && <Loader2 size={18} aria-hidden="true" className="spin" />}
        <p className="form__note">
          <Info size={13} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} aria-hidden="true" />
          Demo form — this build has no mail server, so your details are not transmitted or stored.
          Please call or email us directly.
        </p>
      </div>
    </form>
  );
}
