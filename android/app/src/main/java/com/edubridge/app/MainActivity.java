package com.edubridge.app;

import android.annotation.SuppressLint;
import android.content.SharedPreferences;
import android.graphics.Color;
import android.os.Bundle;
import android.view.KeyEvent;
import android.view.View;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    private WebView webView;
    private SwipeRefreshLayout swipeRefresh;
    private ProgressBar progressBar;
    private static final String PREF_NAME = "EduBridgePrefs";
    private static final String KEY_SERVER_URL = "server_url";
    private static final String DEFAULT_URL = "http://192.168.0.105:3000";

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Dark immersion window styling
        getWindow().setStatusBarColor(Color.parseColor("#030712"));
        getWindow().setNavigationBarColor(Color.parseColor("#030712"));

        // Layout creation programmatically
        FrameLayout rootLayout = new FrameLayout(this);
        rootLayout.setBackgroundColor(Color.parseColor("#030712"));

        swipeRefresh = new SwipeRefreshLayout(this);
        webView = new WebView(this);
        webView.setBackgroundColor(Color.parseColor("#030712"));

        swipeRefresh.addView(webView);
        rootLayout.addView(swipeRefresh);

        progressBar = new ProgressBar(this, null, android.R.attr.progressBarStyleHorizontal);
        progressBar.setMax(100);
        progressBar.setProgress(0);
        progressBar.setVisibility(View.GONE);
        rootLayout.addView(progressBar, new FrameLayout.LayoutParams(
                FrameLayout.LayoutParams.MATCH_PARENT, 8
        ));

        setContentView(rootLayout);

        // Configure Cookies
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        // Configure WebSettings for high performance & Next.js compatibility
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setUserAgentString(settings.getUserAgentString() + " EduBridgeMobileApp/1.0");

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onProgressChanged(WebView view, int newProgress) {
                if (newProgress < 100) {
                    progressBar.setVisibility(View.VISIBLE);
                    progressBar.setProgress(newProgress);
                } else {
                    progressBar.setVisibility(View.GONE);
                    swipeRefresh.setRefreshing(false);
                }
            }
        });

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                return false;
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    String errorHtml = "<html><body style='background:#030712;color:white;font-family:sans-serif;text-align:center;padding:50px 20px;'>" +
                            "<h2 style='color:#38bdf8;'>EduBridge Connection</h2>" +
                            "<p style='color:#94a3b8;font-size:14px;'>Connecting to your local EduBridge server at " + getSavedUrl() + "...</p>" +
                            "<button onclick='location.reload()' style='background:linear-gradient(to right,#2563eb,#059669);color:white;border:none;padding:12px 24px;border-radius:12px;font-size:14px;font-weight:bold;margin-top:20px;cursor:pointer;'>Retry Connection</button>" +
                            "</body></html>";
                    view.loadDataWithBaseURL(null, errorHtml, "text/html", "UTF-8", null);
                }
            }
        });

        swipeRefresh.setOnRefreshListener(() -> webView.reload());

        // Load the EduBridge URL
        webView.loadUrl(getSavedUrl());
    }

    private String getSavedUrl() {
        SharedPreferences prefs = getSharedPreferences(PREF_NAME, MODE_PRIVATE);
        return prefs.getString(KEY_SERVER_URL, DEFAULT_URL);
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        if (keyCode == KeyEvent.KEYCODE_BACK && webView.canGoBack()) {
            webView.goBack();
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
