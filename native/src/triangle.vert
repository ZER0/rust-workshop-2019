
#version 330 core

layout (location = 0) in vec3 Position;
uniform mat4 uModelViewMatrix;

out vec3 Color;

void main()
{
    gl_Position = uModelViewMatrix * vec4(Position, 1.0);
    Color = Position * 0.5 + 0.5;
}
