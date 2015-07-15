/**
 * @license
 * Copyright (c) 2011 NVIDIA Corporation. All rights reserved.
 *
 * TO  THE MAXIMUM  EXTENT PERMITTED  BY APPLICABLE  LAW, THIS SOFTWARE  IS PROVIDED
 * *AS IS*  AND NVIDIA AND  ITS SUPPLIERS DISCLAIM  ALL WARRANTIES,  EITHER  EXPRESS
 * OR IMPLIED, INCLUDING, BUT NOT LIMITED  TO, NONINFRINGEMENT,IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.  IN NO EVENT SHALL  NVIDIA 
 * OR ITS SUPPLIERS BE  LIABLE  FOR  ANY  DIRECT, SPECIAL,  INCIDENTAL,  INDIRECT,  OR  
 * CONSEQUENTIAL DAMAGES WHATSOEVER (INCLUDING, WITHOUT LIMITATION,  DAMAGES FOR LOSS 
 * OF BUSINESS PROFITS, BUSINESS INTERRUPTION, LOSS OF BUSINESS INFORMATION, OR ANY 
 * OTHER PECUNIARY LOSS) ARISING OUT OF THE  USE OF OR INABILITY  TO USE THIS SOFTWARE, 
 * EVEN IF NVIDIA HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
 */
    //This file is automatically rebuilt by the Cesium build process.
    /*global define*/
    define(function() {
    "use strict";
    return "#ifndef FXAA_PRESET\n\
#define FXAA_PRESET 3\n\
#endif\n\
#if (FXAA_PRESET == 3)\n\
#define FXAA_EDGE_THRESHOLD      (1.0/8.0)\n\
#define FXAA_EDGE_THRESHOLD_MIN  (1.0/24.0)\n\
#define FXAA_SEARCH_STEPS        16\n\
#define FXAA_SEARCH_THRESHOLD    (1.0/4.0)\n\
#define FXAA_SUBPIX_CAP          (3.0/4.0)\n\
#define FXAA_SUBPIX_TRIM         (1.0/4.0)\n\
#endif\n\
#if (FXAA_PRESET == 4)\n\
#define FXAA_EDGE_THRESHOLD      (1.0/8.0)\n\
#define FXAA_EDGE_THRESHOLD_MIN  (1.0/24.0)\n\
#define FXAA_SEARCH_STEPS        24\n\
#define FXAA_SEARCH_THRESHOLD    (1.0/4.0)\n\
#define FXAA_SUBPIX_CAP          (3.0/4.0)\n\
#define FXAA_SUBPIX_TRIM         (1.0/4.0)\n\
#endif\n\
#if (FXAA_PRESET == 5)\n\
#define FXAA_EDGE_THRESHOLD      (1.0/8.0)\n\
#define FXAA_EDGE_THRESHOLD_MIN  (1.0/24.0)\n\
#define FXAA_SEARCH_STEPS        32\n\
#define FXAA_SEARCH_THRESHOLD    (1.0/4.0)\n\
#define FXAA_SUBPIX_CAP          (3.0/4.0)\n\
#define FXAA_SUBPIX_TRIM         (1.0/4.0)\n\
#endif\n\
#define FXAA_SUBPIX_TRIM_SCALE (1.0/(1.0 - FXAA_SUBPIX_TRIM))\n\
float FxaaLuma(vec3 rgb) {\n\
return rgb.y * (0.587/0.299) + rgb.x;\n\
}\n\
vec3 FxaaLerp3(vec3 a, vec3 b, float amountOfA) {\n\
return (vec3(-amountOfA) * b) + ((a * vec3(amountOfA)) + b);\n\
}\n\
vec4 FxaaTexOff(sampler2D tex, vec2 pos, ivec2 off, vec2 rcpFrame) {\n\
float x = pos.x + float(off.x) * rcpFrame.x;\n\
float y = pos.y + float(off.y) * rcpFrame.y;\n\
return texture2D(tex, vec2(x, y));\n\
}\n\
vec3 FxaaPixelShader(vec2 pos, sampler2D tex, vec2 rcpFrame)\n\
{\n\
vec3 rgbN = FxaaTexOff(tex, pos.xy, ivec2( 0,-1), rcpFrame).xyz;\n\
vec3 rgbW = FxaaTexOff(tex, pos.xy, ivec2(-1, 0), rcpFrame).xyz;\n\
vec3 rgbM = FxaaTexOff(tex, pos.xy, ivec2( 0, 0), rcpFrame).xyz;\n\
vec3 rgbE = FxaaTexOff(tex, pos.xy, ivec2( 1, 0), rcpFrame).xyz;\n\
vec3 rgbS = FxaaTexOff(tex, pos.xy, ivec2( 0, 1), rcpFrame).xyz;\n\
float lumaN = FxaaLuma(rgbN);\n\
float lumaW = FxaaLuma(rgbW);\n\
float lumaM = FxaaLuma(rgbM);\n\
float lumaE = FxaaLuma(rgbE);\n\
float lumaS = FxaaLuma(rgbS);\n\
float rangeMin = min(lumaM, min(min(lumaN, lumaW), min(lumaS, lumaE)));\n\
float rangeMax = max(lumaM, max(max(lumaN, lumaW), max(lumaS, lumaE)));\n\
float range = rangeMax - rangeMin;\n\
if(range < max(FXAA_EDGE_THRESHOLD_MIN, rangeMax * FXAA_EDGE_THRESHOLD))\n\
{\n\
return rgbM;\n\
}\n\
vec3 rgbL = rgbN + rgbW + rgbM + rgbE + rgbS;\n\
float lumaL = (lumaN + lumaW + lumaE + lumaS) * 0.25;\n\
float rangeL = abs(lumaL - lumaM);\n\
float blendL = max(0.0, (rangeL / range) - FXAA_SUBPIX_TRIM) * FXAA_SUBPIX_TRIM_SCALE;\n\
blendL = min(FXAA_SUBPIX_CAP, blendL);\n\
vec3 rgbNW = FxaaTexOff(tex, pos.xy, ivec2(-1,-1), rcpFrame).xyz;\n\
vec3 rgbNE = FxaaTexOff(tex, pos.xy, ivec2( 1,-1), rcpFrame).xyz;\n\
vec3 rgbSW = FxaaTexOff(tex, pos.xy, ivec2(-1, 1), rcpFrame).xyz;\n\
vec3 rgbSE = FxaaTexOff(tex, pos.xy, ivec2( 1, 1), rcpFrame).xyz;\n\
rgbL += (rgbNW + rgbNE + rgbSW + rgbSE);\n\
rgbL *= vec3(1.0/9.0);\n\
float lumaNW = FxaaLuma(rgbNW);\n\
float lumaNE = FxaaLuma(rgbNE);\n\
float lumaSW = FxaaLuma(rgbSW);\n\
float lumaSE = FxaaLuma(rgbSE);\n\
float edgeVert =\n\
abs((0.25 * lumaNW) + (-0.5 * lumaN) + (0.25 * lumaNE)) +\n\
abs((0.50 * lumaW ) + (-1.0 * lumaM) + (0.50 * lumaE )) +\n\
abs((0.25 * lumaSW) + (-0.5 * lumaS) + (0.25 * lumaSE));\n\
float edgeHorz =\n\
abs((0.25 * lumaNW) + (-0.5 * lumaW) + (0.25 * lumaSW)) +\n\
abs((0.50 * lumaN ) + (-1.0 * lumaM) + (0.50 * lumaS )) +\n\
abs((0.25 * lumaNE) + (-0.5 * lumaE) + (0.25 * lumaSE));\n\
bool horzSpan = edgeHorz >= edgeVert;\n\
float lengthSign = horzSpan ? -rcpFrame.y : -rcpFrame.x;\n\
if(!horzSpan)\n\
{\n\
lumaN = lumaW;\n\
lumaS = lumaE;\n\
}\n\
float gradientN = abs(lumaN - lumaM);\n\
float gradientS = abs(lumaS - lumaM);\n\
lumaN = (lumaN + lumaM) * 0.5;\n\
lumaS = (lumaS + lumaM) * 0.5;\n\
if (gradientN < gradientS)\n\
{\n\
lumaN = lumaS;\n\
lumaN = lumaS;\n\
gradientN = gradientS;\n\
lengthSign *= -1.0;\n\
}\n\
vec2 posN;\n\
posN.x = pos.x + (horzSpan ? 0.0 : lengthSign * 0.5);\n\
posN.y = pos.y + (horzSpan ? lengthSign * 0.5 : 0.0);\n\
gradientN *= FXAA_SEARCH_THRESHOLD;\n\
vec2 posP = posN;\n\
vec2 offNP = horzSpan ? vec2(rcpFrame.x, 0.0) : vec2(0.0, rcpFrame.y);\n\
float lumaEndN = lumaN;\n\
float lumaEndP = lumaN;\n\
bool doneN = false;\n\
bool doneP = false;\n\
posN += offNP * vec2(-1.0, -1.0);\n\
posP += offNP * vec2( 1.0,  1.0);\n\
for(int i = 0; i < FXAA_SEARCH_STEPS; i++) {\n\
if(!doneN)\n\
{\n\
lumaEndN = FxaaLuma(texture2D(tex, posN.xy).xyz);\n\
}\n\
if(!doneP)\n\
{\n\
lumaEndP = FxaaLuma(texture2D(tex, posP.xy).xyz);\n\
}\n\
doneN = doneN || (abs(lumaEndN - lumaN) >= gradientN);\n\
doneP = doneP || (abs(lumaEndP - lumaN) >= gradientN);\n\
if(doneN && doneP)\n\
{\n\
break;\n\
}\n\
if(!doneN)\n\
{\n\
posN -= offNP;\n\
}\n\
if(!doneP)\n\
{\n\
posP += offNP;\n\
}\n\
}\n\
float dstN = horzSpan ? pos.x - posN.x : pos.y - posN.y;\n\
float dstP = horzSpan ? posP.x - pos.x : posP.y - pos.y;\n\
bool directionN = dstN < dstP;\n\
lumaEndN = directionN ? lumaEndN : lumaEndP;\n\
if(((lumaM - lumaN) < 0.0) == ((lumaEndN - lumaN) < 0.0))\n\
{\n\
lengthSign = 0.0;\n\
}\n\
float spanLength = (dstP + dstN);\n\
dstN = directionN ? dstN : dstP;\n\
float subPixelOffset = (0.5 + (dstN * (-1.0/spanLength))) * lengthSign;\n\
vec3 rgbF = texture2D(tex, vec2(\n\
pos.x + (horzSpan ? 0.0 : subPixelOffset),\n\
pos.y + (horzSpan ? subPixelOffset : 0.0))).xyz;\n\
return FxaaLerp3(rgbL, rgbF, blendL);\n\
}\n\
uniform sampler2D u_texture;\n\
uniform vec2 u_step;\n\
varying vec2 v_textureCoordinates;\n\
void main()\n\
{\n\
gl_FragColor = vec4(FxaaPixelShader(v_textureCoordinates, u_texture, u_step), 1.0);\n\
}\n\
";
});