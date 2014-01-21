var server
  , xhr
  , requests;

describe("Fetching of personal documents", function() {

  before(function () {  
    xhr = sinon.useFakeXMLHttpRequest();
    xhr.onCreate = function(xhr) {
      requests.push(xhr);

      xhr.respond(200, 
                  'Content-Type: application/json',
                  '{ "items" : [] }'
                 );
    };
  });
  beforeEach(function() { requests = []; });

  it("should call the personal docs uri", function() {
    var match = /amazon.com.*queryPdocs.html/;
    testFunctionCallsMatchingUri('personal_docs', match);
  });

  it("should return a list of personal documents", function(done) {
    //done('error');
    done();
  });

  commonFetchTests('personal_docs');
});

describe("Fetching of book titles", function() {
  beforeEach(function() { requests = []; });

  commonFetchTests('book_titles');

  it("should call the books uri", function() {
    var match = /amazon.com.*queryOwnership_refactored2.html/;
    testFunctionCallsMatchingUri('book_titles', match);
  });

  it("should return a list of books");
});

function testFunctionCallsMatchingUri(methodName, match) {
    AmazonFiona[methodName]();
    expect(requests).to.have.length(1);
    expect(requests[0].url).to.match(match);
}

function commonFetchTests(methodName) {

  it("should be callable without parameters", function() {
    expect(AmazonFiona[methodName]).not.to.throwException();
  });

  it('should have a default offset of 0', function() {
    AmazonFiona[methodName]();
    expect(requests[0].requestBody.offset).to.be(0);
  });

  it("should add a count to the query when specified", function() {
    AmazonFiona[methodName]({count : 11});
    expect(requests[0].requestBody.count).to.be(11);
  });

  it("should add an offset to the query when specified", function() {
    AmazonFiona[methodName]({offset : 33});
    expect(requests[0].requestBody.offset).to.be(33);
  });

  it("should call the specified callback on success", function(done) {
    AmazonFiona[methodName]({callback: done});
  });
}

/*
   def essential_info_string(item):
   return '[' + item['asin'] + ']  ' + h.unescape(item['title'])

   def fetch_bought_titles(offset=0, count=15):
   return fetch('queryOwnership_refactored2.html', offset, count)

   def fetch_personal_docs(offset=0, count=15):
   return fetch('queryPdocs.html', offset, count)

   def delete_title(content_id):
   r = s.post(amazon+'/gp/digital/fiona/du/fiona-delete.html', data = {'contentName':content_id})

   def fetch(action, offset, count):
   r = s.post(amazon+'/gp/digital/fiona/manage/features/order-history/ajax/' + action,
   data = {'offset':offset,'count':count} )
   clean_json = remove_control_chars(r.text)
   return json.loads(clean_json)['data']

   def remove_control_chars(json_string):
   """remove control characters that are illegal json. Amazon does not remove them"""
   return re.sub('[\x00-\x1f]', '',json_string)

   def init_session(email, password):
   #we need to fake the user agent in order to get amazon to return anything other than 404
   user_agent = "User-Agent:Mozilla/5.0 (Macintosh; Intel Mac OS X 10_8_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/27.0.1453.110 Safari/537.36"
   extra_headers = { 'User-Agent' : user_agent }
   s.headers.update(extra_headers)

   r = s.get(amazon + '/gp/digital/fiona/manage')
   soup = BeautifulSoup(r.content)
   inputs = soup.find_all('input')

   attributes = [i.attrs for i in inputs]
   form_values = {}

   for a in attributes:
   form_values[a.get('name')] = a.get('value')
   form_values.pop(None)

   form_values['email'] = email
   form_values['password'] = password

   # This gets us in. The session cookies are crucial!
   s.post( amazon + '/ap/signin',
   data = form_values,
   allow_redirects=True )

   if __name__ == '__main__':
   if len(sys.argv) < 3:
   usage();

   my_email = sys.argv[1]
   my_password = sys.argv[2]

   init_session(my_email, my_password)
   docs = fetch_personal_docs()
   books = fetch_bought_titles()

status_docs = "Has %s personal documents. The last one is %s"
status_books = "Has bought %s e-book titles from Amazon. The last one is %s"
print(status_docs % (docs['totalCount'], h.unescape(docs['items'][0]['title'])))
print(status_books % (books['totalCount'], h.unescape(books['items'][0]['title'])))
print("Last 15 personal documents:")
for doc in docs['items'][:15]:
print(essential_info_string(doc).encode('utf-8'))


*/
