from django.urls import path,include
# from .views import RegisterView, MyTokenObtainPairView
# from rest_framework_simplejwt.views import TokenRefreshView
from . import views
urlpatterns = [
    # path('',views.index ),
    # path('register/', RegisterView.as_view(), name='register'),
    # path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    # path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]