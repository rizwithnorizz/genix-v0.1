<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleManager
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, $role): Response
    {
        if(!Auth::check()){
            return redirect('login');
        }
        $userRole = Auth::user()->user_type;

        switch($role){
            case 'sa_admin':
                if($userRole == 0){
                    return $next($request);
                }
                break;
            case 'dep_admin':
                if($userRole == 1){
                    return $next($request);;
                }
                break;
            case 'guest':
                if($userRole == 2){
                    return $next($request);
                }
                break;
        }

        switch($userRole){
            case 0:
                return redirect()->route('sa-dashboard');
                break;
            case 1:
                return redirect()->route('dep-dashboard');
                break;
            case 2: 
                return redirect()->route('guest-dashboard');
                break;
        }
        return redirect()->route('login');
    }
}
