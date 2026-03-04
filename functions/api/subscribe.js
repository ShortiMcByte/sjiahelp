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

    const apiKey = context.env.MAILCHIMP_API_KEY;
    if (!apiKey) {
      return new Response(
        JSON.stringify({ success: false, message: "Newsletter temporarily unavailable." }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Update listId and dc after creating the Mailchimp audience for sjiahelp.com
    const listId = "MAILCHIMP_LIST_ID_PLACEHOLDER";
    const dc     = "MAILCHIMP_DC_PLACEHOLDER";  // e.g. "us19" — found in your Mailchimp API key

    const memberData = {
      email_address: email,
      status: "subscribed",
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

    return new Response(
      JSON.stringify({ success: false, message: "Something went wrong. Please try again." }),
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
