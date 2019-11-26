#version 330 core

in vec3 Color;
out vec4 vColor;

void main()
{
    vColor = vec4(Color, 1.0f);
}