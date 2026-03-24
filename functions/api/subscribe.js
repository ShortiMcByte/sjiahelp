export async function onRequestPost(context) {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://sjiahelp.com",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json",
  };

  try {
    const body = await context.request.json();
    const { email, firstName } = body;

    if (!email || !email.includes("@")) {
      return new Response(
        JSON.stringify({ success: false, message: "Valid email required." }),
        { status: 400, headers: corsHeaders }
      );
    }

    const apiKey = context.env.sjiaMailchimpAPIKey;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, message: "Newsletter temporarily unavailable." }),
        { status: 500, headers: corsHeaders }
      );
    }

    const listId = "a6fea79569";
    const dc     = "us18";

    const memberData = {
      email_address: email,
      status: "subscribed",
      ip_signup: context.request.headers.get("CF-Connecting-IP") || "",
      timestamp_signup: new Date().toISOString(),
    };

    if (firstName) {
      memberData.merge_fields = { FNAME: firstName };
    }

    const response = await fetch(
      `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `apikey ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
      }
    );

    const data = await response.json();

    if (response.ok) {
      return new Response(
        JSON.stringify({ success: true, message: "You're on the list! We'll be in touch." }),
        { status: 200, headers: corsHeaders }
      );
    }

    if (data.title === "Member Exists") {
      return new Response(
        JSON.stringify({ success: true, message: "You're already on the list — we'll be in touch!" }),
        { status: 200, headers: corsHeaders }
      );
    }

    if (data.title === "Invalid Resource" && data.detail && data.detail.includes("looks fake or invalid")) {
      return new Response(
        JSON.stringify({ success: false, message: "That email doesn't look right. Please check and try again." }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (data.title === "Forgotten Email Not Subscribed") {
      return new Response(
        JSON.stringify({ success: false, message: "This email was previously removed. Please use a different email or re-subscribe through Mailchimp directly." }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (response.status === 401 || response.status === 403) {
      return new Response(
        JSON.stringify({ success: false, message: "Our mailing list is temporarily being set up. Please check back soon." }),
        { status: 503, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: false, message: `We couldn't add you right now (${data.title || 'unknown error'}). Please try again in a few minutes.` }),
      { status: 500, headers: corsHeaders }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, message: "Server error. Please try again later." }),
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function onRequestOptions(context) {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "https://sjiahelp.com",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
