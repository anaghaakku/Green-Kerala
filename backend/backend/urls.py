from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import HttpResponse

def home(request):
    return HttpResponse("""
    <html>
    <body style="background: #1B5E20; text-align: center; padding: 50px;">
        <div style="background: white; border-radius: 20px; padding: 40px; max-width: 600px; margin: auto;">
            <h1 style="color: #2E7D32;">🌿 HarithaMission API</h1>
            <p>Backend is running!</p>
            <p>Admin Panel: <a href='/admin/'>Click here</a></p>
            <p>API: <a href='/api/rewards/'>/api/rewards/</a></p>
        </div>
    </body>
    </html>
    """)

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('harithamission.urls')),
   path('api/staffapp/', include('staffapp.urls')), 
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)