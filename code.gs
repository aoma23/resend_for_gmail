function createResendButton(e) {

  var composeAction = CardService.newAction()
  .setFunctionName('createDraft');
  var composeButton = CardService.newTextButton()
  .setText('Resend (Create draft)')
  .setComposeAction(composeAction, CardService.ComposedEmailType.STANDALONE_DRAFT);
  
  var section = CardService.newCardSection();
  section.addWidget(composeButton);
  
  var card = CardService.newCardBuilder()
    .addSection(section)
    .build();

  return [card];
}

function createDraft(e) {
  
  var accessToken = e.messageMetadata.accessToken;
  GmailApp.setCurrentMessageAccessToken(accessToken);
  
  var messageId = e.messageMetadata.messageId;
  var message = GmailApp.getMessageById(messageId);

  var options = {
    cc: message.getCc(),
    bcc: message.getBcc()
  };

  var body = message.getBody();
  if (isHtmlMail(message)) {
    body = message.getPlainBody();
    options.htmlBody = message.getBody();
  }

  var draft = GmailApp.createDraft(
    message.getTo(),
    message.getSubject(),
    body,
    options
  );
  
  return CardService.newComposeActionResponseBuilder()
  .setGmailDraft(draft).build();
}

function isHtmlMail(message) {
  if(message.getHeader('Content-Type').indexOf('text/html') !== -1) {
    return true;
  }
  if(message.getHeader('Content-Type').indexOf('multipart/alternative') !== -1) {
    return true;
  }
  return false;
}