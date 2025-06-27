from rest_framework.decorators import api_view
from rest_framework.response import Response
from account.models import Person
from account.serializer import PersonSerializer,RegisterSerializer,LoginSerializer
from rest_framework.views import APIView
from rest_framework import viewsets,status
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
# from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.authentication import TokenAuthentication
from django.http import HttpResponse
# from django.core.paginator import Paginator
# from rest_framework.pagination import PageNumberPagination 
def home(request):
    return HttpResponse("Welcome to MediHub Backend API 🚀")
class RegisterAPI(APIView):
    def post(self,request):
        _data = request.data
        serializer=RegisterSerializer(data=_data)
        if not serializer.is_valid():
            return Response({'message':serializer.errors}, status=status.HTTP_404_NOT_FOUND)
        # serializer =RegisterSerializer(data= _data)
        serializer.save()
        return Response({'message':'User Created'},status.HTTP_201_CREATED)
    
class LoginAPI(APIView):
    # permission_classes = [AllowAny]
    def post(self,request):
        _data=request.data
        serializer=LoginSerializer(data=_data)

        if not serializer.is_valid():
            return Response({'message':serializer.errors}, status=status.HTTP_404_NOT_FOUND)
        
        user=authenticate(username= serializer.data['username'], password=serializer.data['password'])
       
        if not user:
            return Response({'message':"Invalid"},status= status.HTTP_404_NOT_FOUND)
        
        token , _ =Token.objects.get_or_create(user=user)
        return Response({'message':"login successfull",'token': str(token)},status=status.HTTP_200_OK)
    
        
class ClassPerson(APIView):
    # permission_classes = [IsAuthenticated]
    # authentication_classes=[TokenAuthentication]
    def get(self, request):
        objPerson=Person.objects.filter(team__isnull=False)
        serializer=PersonSerializer(objPerson,many=True)
        return Response(serializer.data)
    
    def post(self,request):
        return Response("This is a post method from APIView")
        # try:
        # objPerson = Person.objects.all()
        # page=request.GET.get('page',1)
        # page_size=3
        # paginator=Paginator(objPerson,page_size)         
        # persons_page=Paginator.page(page)
        # serializer = PersonSerializer(paginator.page(page),many=True)
        # return Response(serializer.data)
        # except Exception as e:
        #     return Response({
        #         'message':"Invalid page number"
        #     })
    
@api_view(['GET','POST','PUT'])
def index(request):
    if request.method=='GET':
    
        people_detail={
            'id':2,
            'name':'Praveen',
            'age':30,
            'job':'IT_field'
        }
        return Response(people_detail)
    elif request.method=='POST':
        return Response("THIS IS A POST METHOD")
    elif request.method=='PUT':
        return Response("THIS IS A PUT METHOD")
# people.objects.all()=>[1,2,3,....](queryset)=>JSON===> Serializers
@api_view(['GET','POST','PUT','PATCH','DELETE'])
def person(request):
    if request.method=='GET':
        objPerson = Person.objects.filter(team__isnull=False)
        serializer = PersonSerializer(objPerson,many=True)
        return Response(serializer.data)
    elif request.method=='POST':
        data=request.data
        serializer = PersonSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    elif request.method=='PUT':
        data=request.data
        # obj=Person.objects.get(id=data['id'])    
        
        obj = Person.objects.get(id=data['id'])
          
        serializer = PersonSerializer(obj, data = data , partial = False)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    elif request.method=='PATCH':
        data=request.data
        obj=Person.objects.get(id=data['id'])        
        serializer = PersonSerializer(obj,data=data,partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors)
    else:
        data=request.data
        obj= Person.objects.get(id=data['id'])
        obj.delete()
        return Response({'message':'Person deleted'})
    
# class CustomPagination(PageNumberPagination):
#     page_size=5
#     page_size_query_param='page'

class PersonViewSets(viewsets.ModelViewSet):
    # permission_classes=[]
    serializer_class = PersonSerializer
    queryset= Person.objects.all()
    # pagination_class=CustomPagination

    def list(self,request):
        search= request.GET.get("search")
        queryset =self.queryset

        if search:
            queryset=queryset.filter(name__startswith= search)

        # paginated_queryset=self.paginate_queryset(queryset)

        serializer=PersonSerializer(queryset, many=True)
        return Response({'status':200, 'data':serializer.data})