// defered for now as of 10-Dec-2020

async function emailProvider(email, reading, context) {

    const mailOptions = {
      from: 'SmartViewMD Notifier <notifier@SmartViewMD.com>',
      to: email,
      subject: 'Welcome to SmartViewMD!',
      text: `Hi ${email}!\n\nRecord added to SmartViewMD.com.`,
      html: `<!DOCTYPE html>
      <html style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;">
      <head>
      <meta name="viewport" content="width=device-width" />
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>SmartViewMD.com, your Smart Medical Devices portal</title>
      
      <style type="text/css">
      img {
      max-width: 100%;
      }
      body {
      -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em;
      }
      body {
      background-color: #f6f6f6;
      }
      @media only screen and (max-width: 640px) {
        body {
          padding: 0 !important;
        }
        h1 {
          font-weight: 800 !important; margin: 20px 0 5px !important;
        }
        h2 {
          font-weight: 800 !important; margin: 20px 0 5px !important;
        }
        h3 {
          font-weight: 800 !important; margin: 20px 0 5px !important;
        }
        h4 {
          font-weight: 800 !important; margin: 20px 0 5px !important;
        }
        h1 {
          font-size: 22px !important;
        }
        h2 {
          font-size: 18px !important;
        }
        h3 {
          font-size: 16px !important;
        }
        .container {
          padding: 0 !important; width: 100% !important;
        }
        .content {
          padding: 0 !important;
        }
        .content-wrap {
          padding: 10px !important;
        }
        .invoice {
          width: 100% !important;
        }
      }
      </style>
      </head>
      
      <body itemscope itemtype="http://schema.org/EmailMessage" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; -webkit-font-smoothing: antialiased; -webkit-text-size-adjust: none; width: 100% !important; height: 100%; line-height: 1.6em; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6">
      
      <table class="body-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; background-color: #f6f6f6; margin: 0;" bgcolor="#f6f6f6"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
          <td class="container" width="600" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; display: block !important; max-width: 600px !important; clear: both !important; margin: 0 auto;" valign="top">
            <div class="content" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; max-width: 600px; display: block; margin: 0 auto; padding: 20px;">
              <table class="main" width="100%" cellpadding="0" cellspacing="0" itemprop="action" itemscope itemtype="http://schema.org/ConfirmAction" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; border-radius: 3px; background-color: #fff; margin: 0; border: 1px solid #e9e9e9;" bgcolor="#fff"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-wrap" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 20px;" valign="top">
                    <meta itemprop="name" content="Confirm Email" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;" /><table width="100%" cellpadding="0" cellspacing="0" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
  
                           Hi ${email},
  
                    </td></tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
  
                         A record was added ${JSON.stringify(reading)}.
  
                       </td>
                       </td></tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
  
                       Context ${JSON.stringify(context)}.
  
                     </td>
                      </tr><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0; padding: 0 0 20px;" valign="top">
  
                          &mdash; SmartViewMD.com Customer Support Team
                          
                        </td>
                      </tr></table></td>
                </tr></table><div class="footer" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; width: 100%; clear: both; color: #999; margin: 0; padding: 20px;">
                <table width="100%" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><tr style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; margin: 0;"><td class="aligncenter content-block" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; vertical-align: top; color: #999; text-align: center; margin: 0; padding: 0 0 20px;" align="center" valign="top">Follow <a href="http://twitter.com/SmartViewMD" style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 12px; color: #999; text-decoration: underline; margin: 0;">@SmartViewMD</a> on Twitter.</td>
                  </tr></table></div></div>
          </td>
          <td style="font-family: 'Helvetica Neue',Helvetica,Arial,sans-serif; box-sizing: border-box; font-size: 14px; vertical-align: top; margin: 0;" valign="top"></td>
        </tr></table></body>
      </html>`
    };
  
    await mailTransport.sendMail(mailOptions);
  
    console.log('provider update email sent to:', email);
    example()
    return null;
  }
  
  
  
  //exports.emailProvider = functions.firestore.document('users/{userId}').onUpdate((change,context) => {
    //const newValue = change.after.data();
  //  return emailProvider(email,newValue,context);
  
  exports.emailProvider = functions.firestore.document('users/{userId}/readings/{readingId}').onCreate(async (snap,context) => {
    //const userRef = admin.firestore().collection('users').doc(context.params.userId);
    const newValue = snap.data();
    const doc = await db.doc(`users/${context.params.userId}`).get();
  
    // const doc = await userRef.get();
    // if (!doc.exists) {
    //   console.log('No such document!');
    // } else {
    //   console.log('Document data:', doc.data());
    // }  
    // const newValue = reading.after.data();
    // const ref = reading.ref
    // const userRef = ref.parent.parent;
    // const user = await userRef.get()
    // const user = userRef.get().then(parentSnap => {
    //     const user = parentSnap.data();
    //     //const lastSeen = user.last_seen;
    //     return user;
    // });
  
    const email = "dom@belleit.net";
    return emailProvider( email , newValue , doc  );
  });
  
  
  ////
  
  
  const PhiMailConnector = require('./smartviewmd/phimail-connector.js'), fs = require('fs')
  
  /**
   *
   * @author Dominique Northecide
   */
  
  // Specify which parts of the example to run.
  // Note: Send and receive examples are grouped here for demonstration
  // purposes only. In general, the receive function would run separately 
  // on a regular schedule, e.g. once per minute. 
  const send = true 
  //var receive = true
  
  const phiMailServer = 'sandbox.phimail-dev.com'
  const phiMailPort = 32541 // this is the default port #
  
  const phiMailUser = 'belleit@test.directproject.net'
  const phiMailPass = 'bykc56li'
  
  const outboundRecipient = 'belleit@test.directproject.net'
  //var attachmentSaveDirectory = '/tmp/'
  
  let pc = null
  
  function example() {
  
    // This command sets the trusted SSL certificate or
    // trust anchor for the phiMail server.
    PhiMailConnector.setServerCertificate('./smartviewmd/EMRDirectTestCA.pem')
  
    // Use the following command to enable client TLS authentication, if
    // required. The key file referenced should contain the following
    // PEM data concatenated into one file:
    //   <your_private_key.pem> encrypted with my_password
    //   <your_client_certificate.pem>
    //   <intermediate_CA_certificate.pem>
    //   <root_CA_certificate.pem>
    //
    //PhiMailConnector.setClientCertificate('./mycert.pem','my_password')
  
    pc = new PhiMailConnector(phiMailServer, phiMailPort, authenticate)
   
    function authenticate(err) {
      if (err) return close_and_quit(err)
      pc.authenticateUser(phiMailUser,phiMailPass,send_if_requested)
    }
  
    function send_if_requested(err) {
      if (err) return close_and_quit(err)
      if (send) return pmc_send(close_and_quit)
      return receive_if_requested()
    }
  
    function close_and_quit(err) {
      if (err) console.log('phiMail ' + err)
      // try to close connection anyway
      pc.close(example_finish)
    }
  
    function example_finish(err) {
      if (err) console.log('phiMail ' + err)
      console.log('phiMail example finished.')
    }
  }
  
  function pmc_send(cb) {
    // Sample code to send a Direct message.
  
    console.log('Sending a CDA as an attachment')
  
    // After authentication, the server has a blank outgoing message
    // template. Begin building this message by adding a recipient.
    // Multiple recipients can be added by calling this command more
    // than once. A separate message will be sent for each recipient.
    pc.addRecipient(outboundRecipient,post_add_recipient)
  
    function post_add_recipient(err, recipientData) {
  
      // The server returns information about the recipient if the
      // address entered is accepted, otherwise an error is returned.
      // How you use this recipient information is up to you...
      if (err) return cb(err)
      console.log('recipient info: ' + recipientData)
  
      do_set_subject()
    }
  
    function do_set_subject() {
  
      // this actually replaces a few of the do_* functions then ties back in at do_send
     
      let commands = []
      commands.push(function(cb2) { pc.setSubject('SmartViewMD Test Subject', cb2) })
      commands.push(function(cb2) { pc.addText('The message body. CDA img pdf attached', cb2) })
      commands.push(function(cb2) { pc.addCDA(fs.readFileSync('./test_files/outbound_cda.xml'), cb2) })
      commands.push(function(cb2) { pc.addRaw(fs.readFileSync('./test_files/15443521-a808-4d16-a3bc-e99a79887bee.gif'), '15443521-a808-4d16-a3bc-e99a79887bee.gif', cb2) })
      commands.push(function(cb2) { pc.addRaw(fs.readFileSync('./test_files/UD_sample.pdf'), 'BelleIT_sample.pdf', cb2) })
      async.series(commands, function(err, results) {
        // we can ignore results since none of the commands will return any results
        if (err) return cb(err)
        do_send()
       }
      )
     }
  
    function do_send(err) {
      if (err) return cb(err)
  
      // Send the message. srList will contain one entry for each recipient.
      // If more than one recipient was specified, then each would have an entry.
      pc.send(post_send)
    }
  
    function post_send(err,srList) {
      if (err) return cb(err)
      srList.forEach(
        function(sr) {
      console.log('Send to ' + sr.recipient
       + (sr.succeeded ? ' succeeded id=' : ' failed err=')
       + (sr.succeeded ? sr.messageId : sr.errorText))
        })
      return cb()
    }
  }
  
  // Run the example code
  //example()
  